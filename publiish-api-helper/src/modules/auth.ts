import axios from "axios";

export class Auth {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async signup( args: {
    email: string;
    password: string;
    brand_name: string;
  }) {
    try {
      const data = {
        email: args.email,
        password: args.password,
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
    password: string;
  }) {
    try {
      const data = {
        email: args.email,
        password: args.password,
      };

      const url = `${this.url}/api/auth/signin`;
      return await axios.post(url, data);
    } catch(error) {
      throw error;
    }
  }
}