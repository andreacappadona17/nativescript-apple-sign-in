"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("tns-core-modules/platform");
var utils_1 = require("tns-core-modules/utils/utils");
var jsArrayToNSArray = utils_1.ios.collections.jsArrayToNSArray;
var controller;
var delegate;
function isSignInWithAppleSupported() {
    return parseInt(platform_1.device.osVersion) >= 13;
}
exports.isSignInWithAppleSupported = isSignInWithAppleSupported;
function getSignInWithAppleState(user) {
    return new Promise(function (resolve, reject) {
        if (!user) {
            reject("The 'user' parameter is mandatory");
            return;
        }
        if (!isSignInWithAppleSupported()) {
            reject("Not supported");
            return;
        }
        var provider = ASAuthorizationAppleIDProvider.new();
        provider.getCredentialStateForUserIDCompletion(user, function (state, error) {
            if (error) {
                reject(error.localizedDescription);
                return;
            }
            if (state === 1) {
                resolve("AUTHORIZED");
            }
            else if (state === 2) {
                resolve("NOTFOUND");
            }
            else if (state === 3) {
                resolve("REVOKED");
            }
            else {
                reject("Invalid state for getSignInWithAppleState: " + state + ", please report an issue at he plugin repo!");
            }
        });
    });
}
exports.getSignInWithAppleState = getSignInWithAppleState;
function signInWithApple(options) {
    return new Promise(function (resolve, reject) {
        if (!isSignInWithAppleSupported()) {
            reject("Not supported");
            return;
        }
        var provider = ASAuthorizationAppleIDProvider.new();
        var request = provider.createRequest();
        if (options && options.user) {
            request.user = options.user;
        }
        if (options && options.scopes) {
            var nsArray_1 = NSMutableArray.new();
            options.scopes.forEach(function (s) {
                if (s === "EMAIL") {
                    nsArray_1.addObject(ASAuthorizationScopeEmail);
                }
                else if (s === "FULLNAME") {
                    nsArray_1.addObject(ASAuthorizationScopeFullName);
                }
                else {
                    console.log("Unsupported scope: " + s + ", use either EMAIL or FULLNAME");
                }
            });
            request.requestedScopes = nsArray_1;
        }
        controller = ASAuthorizationController.alloc().initWithAuthorizationRequests(jsArrayToNSArray([request]));
        controller.delegate = delegate = ASAuthorizationControllerDelegateImpl.createWithPromise(resolve, reject);
        controller.performRequests();
    });
}
exports.signInWithApple = signInWithApple;
var ASAuthorizationControllerDelegateImpl = (function (_super) {
    __extends(ASAuthorizationControllerDelegateImpl, _super);
    function ASAuthorizationControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ASAuthorizationControllerDelegateImpl.new = function () {
        try {
            ASAuthorizationControllerDelegateImpl.ObjCProtocols.push(ASAuthorizationControllerDelegate);
            return _super.new.call(this);
        }
        catch (ignore) {
            console.log("Apple Sign In not supported on this device - it requires iOS 13+. Tip: use 'isSignInWithAppleSupported' before calling 'signInWithApple'.");
            return null;
        }
    };
    ASAuthorizationControllerDelegateImpl.createWithPromise = function (resolve, reject) {
        var delegate = ASAuthorizationControllerDelegateImpl.new();
        if (delegate === null) {
            reject("Not supported");
        }
        else {
            delegate.resolve = resolve;
            delegate.reject = reject;
        }
        return delegate;
    };
    ASAuthorizationControllerDelegateImpl.prototype.authorizationControllerDidCompleteWithAuthorization = function (controller, authorization) {
        console.log(">>> credential.state: " + authorization.credential.state);
        this.resolve({
            user: authorization.credential.user,
            email: authorization.credential.email,
        });
    };
    ASAuthorizationControllerDelegateImpl.prototype.authorizationControllerDidCompleteWithError = function (controller, error) {
        this.reject(error.localizedDescription);
    };
    ASAuthorizationControllerDelegateImpl.ObjCProtocols = [];
    return ASAuthorizationControllerDelegateImpl;
}(NSObject));
//# sourceMappingURL=apple-sign-in.ios.js.map