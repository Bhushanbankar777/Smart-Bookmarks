(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/auth/callback/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthCallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AuthCallback() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthCallback.useEffect": ()=>{
            let mounted = true;
            const handleAuthCallback = {
                "AuthCallback.useEffect.handleAuthCallback": async ()=>{
                    try {
                        // Wait for Supabase to process the OAuth callback from the URL
                        const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                        if (!mounted) return;
                        if (sessionError) {
                            console.error('Session error:', sessionError);
                            setIsProcessing(false);
                            router.push('/');
                            return;
                        }
                        if (session) {
                            // Session exists, redirect to dashboard
                            console.log('Session found, redirecting to dashboard');
                            setIsProcessing(false);
                            router.push('/dashboard');
                            return;
                        }
                        // If no session yet, listen for auth state changes
                        // This handles the case where OAuth callback is still being processed
                        const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                            "AuthCallback.useEffect.handleAuthCallback": async (event, newSession)=>{
                                if (!mounted) return;
                                console.log('Auth state changed:', event);
                                if (event === 'SIGNED_IN' && newSession) {
                                    console.log('User signed in, redirecting to dashboard');
                                    setIsProcessing(false);
                                    router.push('/dashboard');
                                }
                            }
                        }["AuthCallback.useEffect.handleAuthCallback"]);
                        // Timeout after 10 seconds to prevent infinite waiting
                        const timeoutId = setTimeout({
                            "AuthCallback.useEffect.handleAuthCallback.timeoutId": ()=>{
                                if (mounted) {
                                    console.error('Auth callback timeout');
                                    setIsProcessing(false);
                                    router.push('/');
                                }
                            }
                        }["AuthCallback.useEffect.handleAuthCallback.timeoutId"], 10000);
                        return ({
                            "AuthCallback.useEffect.handleAuthCallback": ()=>{
                                clearTimeout(timeoutId);
                                subscription?.unsubscribe();
                            }
                        })["AuthCallback.useEffect.handleAuthCallback"];
                    } catch (error) {
                        console.error('Auth callback error:', error);
                        if (mounted) {
                            setIsProcessing(false);
                            router.push('/');
                        }
                    }
                }
            }["AuthCallback.useEffect.handleAuthCallback"];
            const cleanup = handleAuthCallback();
            return ({
                "AuthCallback.useEffect": ()=>{
                    mounted = false;
                    cleanup?.then({
                        "AuthCallback.useEffect": (unsub)=>unsub?.()
                    }["AuthCallback.useEffect"]);
                }
            })["AuthCallback.useEffect"];
        }
    }["AuthCallback.useEffect"], [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-center min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Redirecting..."
        }, void 0, false, {
            fileName: "[project]/app/auth/callback/page.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/auth/callback/page.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
_s(AuthCallback, "FxKcTXiJ4hXWFYPVAJCQxyYGOz8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthCallback;
var _c;
__turbopack_context__.k.register(_c, "AuthCallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_0c74610a._.js.map