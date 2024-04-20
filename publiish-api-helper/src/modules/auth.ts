import axios from "axios";

export class Auth {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async signup( args: {
    email: string;
    brand_name: string;
  }) {
    try {
      const data = {
        email: args.email,
        brand_name: args.brand_name
      };

      const url = `${this.url}/api/auth/signup`;
      return await axios.post(url, data);
    } catch(error) {
      throw error;
    }
  }

  public async signin( args: {
    email: string;
  }) {
    try {
      const data = {
        email: args.email,
      };

      const url = `${this.url}/api/auth/signin`;
      return await axios.post(url, data);
    } catch(error) {
      throw error;
    }
  }
}