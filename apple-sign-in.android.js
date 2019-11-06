"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSignInWithAppleSupported() {
    return false;
}
exports.isSignInWithAppleSupported = isSignInWithAppleSupported;
function getSignInWithAppleState() {
    return Promise.reject("Not supported");
}
exports.getSignInWithAppleState = getSignInWithAppleState;
function signInWithApple() {
    return Promise.reject("Not supported");
}
exports.signInWithApple = signInWithApple;
//# sourceMappingURL=apple-sign-in.android.js.map