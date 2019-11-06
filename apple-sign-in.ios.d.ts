import { SignInWithAppleCredentials, SignInWithAppleOptions, SignInWithAppleState } from "./index";
export declare function isSignInWithAppleSupported(): boolean;
export declare function getSignInWithAppleState(user: string): Promise<SignInWithAppleState>;
export declare function signInWithApple(options?: SignInWithAppleOptions): Promise<SignInWithAppleCredentials>;
