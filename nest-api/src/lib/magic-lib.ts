import { HttpException, HttpStatus } from "@nestjs/common"

export function parseMagic({ issuer, email, publicAddress }) {
  if (!issuer || !email || !publicAddress) {
    throw new HttpException(
      'Login or register failed. Metadata could not be fetched.',
      HttpStatus.BAD_REQUEST
    )
  }
  const name = email.split('@')[0]
  return {
    sub: issuer,
    nickname: name,
    name: name,
    picture: '',
    email,
    issuer,
    publicAddress,
    tokens: {},
  }
}