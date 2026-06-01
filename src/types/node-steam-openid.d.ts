declare module "node-steam-openid" {
  interface SteamAuthOptions {
    realm: string;
    returnUrl: string;
    apiKey: string;
  }
  interface SteamUser {
    steamid: string;
    username: string;
    name: string;
    profile: string;
    avatar: { small: string; medium: string; large: string };
  }
  export default class SteamAuth {
    constructor(options: SteamAuthOptions);
    getRedirectUrl(): Promise<string>;
    authenticate(req: { url: string; headers?: Record<string, string> }): Promise<SteamUser>;
  }
}
