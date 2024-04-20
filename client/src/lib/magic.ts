import { Magic } from 'magic-sdk';
import { OAuthExtension, OAuthProvider } from '@magic-ext/oauth';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';

const MAGIC_TOKEN = process.env.NEXT_PUBLIC_MAGIC_TOKEN ?? "";
/** @type {import('magic-sdk').Magic | null} */
let magic: InstanceWithExtensions<SDKBase, OAuthExtension[]> | null = null;

export function getMagic() {
  if (magic) {
    return magic;
  }
  magic = new Magic(MAGIC_TOKEN, {
    extensions: [new OAuthExtension()],
    testMode: true,
  });
  return magic;
}

/**
 * Login request
 *
 * @param {string} [token]
 */
export async function login(token: string, type = 'magic', data = {}) {
  const API = "";
  const res = await fetch(API + '/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      type,
      data,
    }),
  });
  if (!res.ok) {
    const resText = await res.text();
    // try to parse as json
    let resJson = undefined;
    try {
      resJson = JSON.parse(resText);
    } catch (error) {
      if (error instanceof Error && error.name === 'SyntaxError') {
        // expected
      } else {
        throw error;
      }
    }
    if (resJson) {
      switch (resJson.code) {
        case 'NEW_USER_DENIED_TRY_OTHER_PRODUCT':
          throw Object.assign(new Error(resJson.message || 'NEW_USER_DENIED_TRY_OTHER_PRODUCT'), resJson);
        default:
        // unknown code
      }
    }
    throw new Error(`failed to login user: ${resText}`);
  }
  return res.json();
}

export async function isLoggedIn() {
  return getMagic().user.isLoggedIn();
}

/**
 * Login with email
 *
 * @param {string} email
 * @param {string} [finalRedirectHref] - href of final url that end-user should
 *  be redirected to after successful authentication
 */
export async function loginEmail(email: string, finalRedirectHref: string) {
  const redirectUri = new URL('/callback/', window.location.origin);
  if (finalRedirectHref) {
    redirectUri.searchParams.set('redirect_uri', finalRedirectHref);
  }
  const didToken = await getMagic().auth.loginWithMagicLink({
    email: email,
    redirectURI: redirectUri.href,
  });

  if (didToken) {
    return didToken;
  }

  throw new Error('Login failed.');
}

/**
 * Login with social
 *
 * @param {string} provider
 */
export async function loginSocial(provider: OAuthProvider) {
  // @ts-ignore - TODO fix Magic extension types
  await getMagic().oauth.loginWithRedirect({
    provider,
    redirectURI: new URL('/callback/', window.location.origin).href,
  });
}

export async function redirectMagic() {
  const idToken = await getMagic().auth.loginWithCredential();
  if (idToken) {
    try {
      const data = await login(idToken);
      return { ...data, idToken };
    } catch (err) {
      await getMagic().user.logout();
      throw err;
    }
  }

  throw new Error('Login failed.');
}

export async function redirectSocial() {
  // @ts-ignore - TODO fix Magic extension types
  const result = await getMagic().oauth.getRedirectResult();
  try {
    const data = await login(result.magic.idToken, 'github', result);
    return { ...data, idToken: result.magic.idToken };
  } catch (err) {
    await getMagic().user.logout();
    throw err;
  }
}
