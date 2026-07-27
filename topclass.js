const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/home-minimal-Cdgj6g75.js","assets/vendor-BWFEybbX.js","assets/preload-DNrUkv91.js","assets/MainFooter-NYYaS6ev.js","assets/LazyImage-CF7uszDE.js","assets/utils-s6DR3a-c.js","assets/corporate-Bpc7sNTc.js","assets/Footer-CJBqK_-C.js","assets/internet-fiber-CviMzWWf.js","assets/layanan-digital-CTb80Q2i.js","assets/iot-solutions-Bvg8zdN3.js","assets/profil-perusahaan-BcCW8azQ.js","assets/tentang-kami-C0JzPmap.js","assets/karir-BCGHiQzQ.js","assets/partner-D6CgWMrE.js","assets/kontak-C6ghZMN7.js","assets/terms-ZrnSfxYA.js","assets/privacy-C0dDmM2w.js","assets/coverage-area-CmBKK2Nh.js","assets/partners-na2EaaPw.js","assets/godaddy-partnership-D607CoHl.js","assets/blog-CODgDAtX.js","assets/_slug_-BfV7e8M0.js","assets/help-center-C88obkQl.js","assets/payment-BHl8A5j3.js","assets/index-B1MXCfOT.js","assets/login-CPCJ2yHH.js","assets/security-CXstElrK.js","assets/button-BhTC1DwQ.js","assets/label-C-cWeEPV.js","assets/forgot-password-B1s68OZP.js","assets/reset-password-DdbWJJwq.js","assets/index-XCnFbXyY.js","assets/blog-BEp0Luly.js","assets/ProtectedRoute-DEvo2NaX.js","assets/ai-content-Cc1N629a.js","assets/wordpress-test-Dt03jtYN.js","assets/radius-dashboard-B_jOw6ZZ.js","assets/system-status-C9XE-uTZ.js","assets/payment-dashboard-C3ea_aR9.js","assets/billing-DsIcKJkn.js","assets/_id_-DckA8_3t.js","assets/server-architecture-CI-hae-H.js","assets/dashboard-gl5N3ZlD.js","assets/invoices-IERlBOiB.js","assets/index-Bmym6yoE.js","assets/index-CeCFBcsv.js","assets/index-CEJOKevu.js","assets/index-DCTR3lJ6.js","assets/TopBar-CZAAae3K.js","assets/customers-XFTLeW73.js","assets/billing-DP8di2II.js","assets/radius-HxSO2sVO.js","assets/devices-TxfeMOeP.js","assets/reports-Di-V3IEZ.js","assets/settings-C8rYVwK4.js","assets/wordpress-integration-fz2OJ6M8.js","assets/system-check-Cu-_BVIq.js","assets/radius-setup-guide-U8f2Xm_n.js","assets/_404-BY86RmkS.js","assets/internet-fiber-minimal-DRI7E655.js","assets/iot-solutions-minimal-DJjCQEo8.js","assets/layanan-digital-minimal-Cd0GnS1Y.js","assets/privacy-minimal-CY4WXenO.js","assets/terms-minimal-BYu3zApV.js","assets/CookieBanner-0Wcl77mL.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from "./preload-DNrUkv91.js";
import { r as reactExports, j as jsxRuntimeExports, c as createBrowserRouter, R as RouterProvider2, O as Outlet, Q as QueryClient, a as ReactDOM, H as HelmetProvider, b as React2, d as QueryClientProvider } from "./vendor-BWFEybbX.js";
class CookieBannerErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error) {
    return {
      hasError: true
    };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("CookieBanner error boundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
function RootLayout({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground", children });
}
function Spinner({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-block ${className || ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "animate-spin h-8 w-8 text-gray-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-10", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-20", fill: "currentColor", d: "m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
  ] }) });
}
const HomeMinimalPage = reactExports.lazy(() => __vitePreload(() => import("./home-minimal-Cdgj6g75.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0));
const CorporatePage = reactExports.lazy(() => __vitePreload(() => import("./corporate-Bpc7sNTc.js"), true ? __vite__mapDeps([6,1,2,7,4,5]) : void 0));
const InternetFiberPage = reactExports.lazy(() => __vitePreload(() => import("./internet-fiber-CviMzWWf.js"), true ? __vite__mapDeps([8,1,2,3,4,5]) : void 0));
const LayananDigitalPage = reactExports.lazy(() => __vitePreload(() => import("./layanan-digital-CTb80Q2i.js"), true ? __vite__mapDeps([9,1,2,3,4,5]) : void 0));
const IoTSolutionsPage = reactExports.lazy(() => __vitePreload(() => import("./iot-solutions-Bvg8zdN3.js"), true ? __vite__mapDeps([10,1,2,3,4,5]) : void 0));
const ProfilPerusahaanPage = reactExports.lazy(() => __vitePreload(() => import("./profil-perusahaan-BcCW8azQ.js"), true ? __vite__mapDeps([11,1,2,3,4,5]) : void 0));
const TentangKamiPage = reactExports.lazy(() => __vitePreload(() => import("./tentang-kami-C0JzPmap.js"), true ? __vite__mapDeps([12,1,2,3,4,5]) : void 0));
const KarirPage = reactExports.lazy(() => __vitePreload(() => import("./karir-BCGHiQzQ.js"), true ? __vite__mapDeps([13,1,2,3,4,5]) : void 0));
const PartnerPage = reactExports.lazy(() => __vitePreload(() => import("./partner-D6CgWMrE.js"), true ? __vite__mapDeps([14,1,2,3,4,5]) : void 0));
const KontakPage = reactExports.lazy(() => __vitePreload(() => import("./kontak-C6ghZMN7.js"), true ? __vite__mapDeps([15,1,2,3,4,5]) : void 0));
const TermsPage = reactExports.lazy(() => __vitePreload(() => import("./terms-ZrnSfxYA.js"), true ? __vite__mapDeps([16,1,2,4,5]) : void 0));
const PrivacyPage = reactExports.lazy(() => __vitePreload(() => import("./privacy-C0dDmM2w.js"), true ? __vite__mapDeps([17,1,2,4,5]) : void 0));
const CoverageAreaPage = reactExports.lazy(() => __vitePreload(() => import("./coverage-area-CmBKK2Nh.js"), true ? __vite__mapDeps([18,1,2,3,4,5]) : void 0));
const PartnersPage = reactExports.lazy(() => __vitePreload(() => import("./partners-na2EaaPw.js"), true ? __vite__mapDeps([19,1,2]) : void 0));
const GoDaddyPartnershipPage = reactExports.lazy(() => __vitePreload(() => import("./godaddy-partnership-D607CoHl.js"), true ? __vite__mapDeps([20,1,2,3,4,5]) : void 0));
const BlogPage = reactExports.lazy(() => __vitePreload(() => import("./blog-CODgDAtX.js"), true ? __vite__mapDeps([21,1,2,3,4,5]) : void 0));
const BlogDetailPage = reactExports.lazy(() => __vitePreload(() => import("./_slug_-BfV7e8M0.js"), true ? __vite__mapDeps([22,1,2,4,5]) : void 0));
const HelpCenterPage = reactExports.lazy(() => __vitePreload(() => import("./help-center-C88obkQl.js"), true ? __vite__mapDeps([23,1,2,7,4,5]) : void 0));
const PaymentPage = reactExports.lazy(() => __vitePreload(() => import("./payment-BHl8A5j3.js"), true ? __vite__mapDeps([24,1,2]) : void 0));
const PortalPelangganPage = reactExports.lazy(() => __vitePreload(() => import("./index-B1MXCfOT.js"), true ? __vite__mapDeps([25,1,2]) : void 0));
const PortalLoginPage = reactExports.lazy(() => __vitePreload(() => import("./login-CPCJ2yHH.js"), true ? __vite__mapDeps([26,1,2]) : void 0));
const PortalSecurityPage = reactExports.lazy(() => __vitePreload(() => import("./security-CXstElrK.js"), true ? __vite__mapDeps([27,1,2,28,5,29]) : void 0));
const PortalForgotPasswordPage = reactExports.lazy(() => __vitePreload(() => import("./forgot-password-B1s68OZP.js"), true ? __vite__mapDeps([30,1,2]) : void 0));
const PortalResetPasswordPage = reactExports.lazy(() => __vitePreload(() => import("./reset-password-DdbWJJwq.js"), true ? __vite__mapDeps([31,1,2]) : void 0));
const PortalAdminPage = reactExports.lazy(() => __vitePreload(() => import("./index-XCnFbXyY.js"), true ? __vite__mapDeps([32,1,2]) : void 0));
const PortalAdminBlogPage = reactExports.lazy(() => __vitePreload(() => import("./blog-BEp0Luly.js"), true ? __vite__mapDeps([33,1,2,34]) : void 0));
const PortalAdminAIContentPage = reactExports.lazy(() => __vitePreload(() => import("./ai-content-Cc1N629a.js"), true ? __vite__mapDeps([35,1,2,28,5,29,34]) : void 0));
const PortalAdminWordPressTestPage = reactExports.lazy(() => __vitePreload(() => import("./wordpress-test-Dt03jtYN.js"), true ? __vite__mapDeps([36,1,2,34]) : void 0));
const PortalAdminRadiusDashboardPage = reactExports.lazy(() => __vitePreload(() => import("./radius-dashboard-B_jOw6ZZ.js"), true ? __vite__mapDeps([37,1,2,34]) : void 0));
const PortalAdminSystemStatusPage = reactExports.lazy(() => __vitePreload(() => import("./system-status-C9XE-uTZ.js"), true ? __vite__mapDeps([38,1,2,34]) : void 0));
const PortalAdminPaymentDashboardPage = reactExports.lazy(() => __vitePreload(() => import("./payment-dashboard-C3ea_aR9.js"), true ? __vite__mapDeps([39,1,2]) : void 0));
const PortalAdminBillingPage = reactExports.lazy(() => __vitePreload(() => import("./billing-DsIcKJkn.js"), true ? __vite__mapDeps([40,1,2,34]) : void 0));
const PortalAdminBillingDetailPage = reactExports.lazy(() => __vitePreload(() => import("./_id_-DckA8_3t.js"), true ? __vite__mapDeps([41,1,2,34]) : void 0));
const PortalAdminServerArchPage = reactExports.lazy(() => __vitePreload(() => import("./server-architecture-CI-hae-H.js"), true ? __vite__mapDeps([42,1,2,34]) : void 0));
const PortalCustomerDashboardPage = reactExports.lazy(() => __vitePreload(() => import("./dashboard-gl5N3ZlD.js"), true ? __vite__mapDeps([43,1,2]) : void 0));
const PortalCustomerInvoicesPage = reactExports.lazy(() => __vitePreload(() => import("./invoices-IERlBOiB.js"), true ? __vite__mapDeps([44,1,2,34]) : void 0));
const PortalTechnicianPage = reactExports.lazy(() => __vitePreload(() => import("./index-Bmym6yoE.js"), true ? __vite__mapDeps([45,1,2]) : void 0));
const PortalBillingPage = reactExports.lazy(() => __vitePreload(() => import("./index-CeCFBcsv.js"), true ? __vite__mapDeps([46,1,2]) : void 0));
const PortalSupportPage = reactExports.lazy(() => __vitePreload(() => import("./index-CEJOKevu.js"), true ? __vite__mapDeps([47,1,2]) : void 0));
const HomePage = reactExports.lazy(() => __vitePreload(() => import("./index-DCTR3lJ6.js"), true ? __vite__mapDeps([48,1,2,49]) : void 0));
const CustomersPage = reactExports.lazy(() => __vitePreload(() => import("./customers-XFTLeW73.js"), true ? __vite__mapDeps([50,1,2,49]) : void 0));
const BillingPage = reactExports.lazy(() => __vitePreload(() => import("./billing-DP8di2II.js"), true ? __vite__mapDeps([51,1,2,49]) : void 0));
const RadiusPage = reactExports.lazy(() => __vitePreload(() => import("./radius-HxSO2sVO.js"), true ? __vite__mapDeps([52,1,2,49]) : void 0));
const DevicesPage = reactExports.lazy(() => __vitePreload(() => import("./devices-TxfeMOeP.js"), true ? __vite__mapDeps([53,1,2,49]) : void 0));
const ReportsPage = reactExports.lazy(() => __vitePreload(() => import("./reports-Di-V3IEZ.js"), true ? __vite__mapDeps([54,1,2,49]) : void 0));
const SettingsPage = reactExports.lazy(() => __vitePreload(() => import("./settings-C8rYVwK4.js"), true ? __vite__mapDeps([55,1,2,49]) : void 0));
const WordPressIntegrationPage = reactExports.lazy(() => __vitePreload(() => import("./wordpress-integration-fz2OJ6M8.js"), true ? __vite__mapDeps([56,1,2,49]) : void 0));
const SystemCheckPage = reactExports.lazy(() => __vitePreload(() => import("./system-check-Cu-_BVIq.js"), true ? __vite__mapDeps([57,1,2]) : void 0));
const RadiusSetupGuide = reactExports.lazy(() => __vitePreload(() => import("./radius-setup-guide-U8f2Xm_n.js"), true ? __vite__mapDeps([58,1,2]) : void 0));
const NotFoundPage = reactExports.lazy(() => __vitePreload(() => import("./_404-BY86RmkS.js"), true ? __vite__mapDeps([59,1,2]) : void 0));
const InternetFiberMinimalPage = reactExports.lazy(() => __vitePreload(() => import("./internet-fiber-minimal-DRI7E655.js"), true ? __vite__mapDeps([60,1,2]) : void 0));
const IoTSolutionsMinimalPage = reactExports.lazy(() => __vitePreload(() => import("./iot-solutions-minimal-DJjCQEo8.js"), true ? __vite__mapDeps([61,1,2]) : void 0));
const LayananDigitalMinimalPage = reactExports.lazy(() => __vitePreload(() => import("./layanan-digital-minimal-Cd0GnS1Y.js"), true ? __vite__mapDeps([62,1,2]) : void 0));
const PrivacyMinimalPage = reactExports.lazy(() => __vitePreload(() => import("./privacy-minimal-CY4WXenO.js"), true ? __vite__mapDeps([63,1,2]) : void 0));
const TermsMinimalPage = reactExports.lazy(() => __vitePreload(() => import("./terms-minimal-BYu3zApV.js"), true ? __vite__mapDeps([64,1,2]) : void 0));
function PageLoader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Memuat halaman…" })
  ] }) });
}
function w(element) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}), children: element });
}
const routes = [{
  path: "/",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(HomeMinimalPage, {}))
}, {
  path: "/home",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(HomeMinimalPage, {}))
}, {
  path: "/corporate",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(CorporatePage, {}))
}, {
  path: "/internet-fiber",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(InternetFiberPage, {}))
}, {
  path: "/layanan-digital",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(LayananDigitalPage, {}))
}, {
  path: "/iot-solutions",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(IoTSolutionsPage, {}))
}, {
  path: "/profil-perusahaan",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(ProfilPerusahaanPage, {}))
}, {
  path: "/tentang-kami",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(TentangKamiPage, {}))
}, {
  path: "/karir",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(KarirPage, {}))
}, {
  path: "/partner",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PartnerPage, {}))
}, {
  path: "/kontak",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(KontakPage, {}))
}, {
  path: "/terms",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(TermsPage, {}))
}, {
  path: "/privacy",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PrivacyPage, {}))
}, {
  path: "/coverage-area",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(CoverageAreaPage, {}))
}, {
  path: "/partners",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PartnersPage, {}))
}, {
  path: "/godaddy-partnership",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(GoDaddyPartnershipPage, {}))
}, {
  path: "/blog",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(BlogPage, {}))
}, {
  path: "/blog/:slug",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(BlogDetailPage, {}))
}, {
  path: "/help-center",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(HelpCenterPage, {}))
}, {
  path: "/portal",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalPelangganPage, {}))
}, {
  path: "/portal/login",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalLoginPage, {}))
}, {
  path: "/portal/security",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalSecurityPage, {}))
}, {
  path: "/portal/forgot-password",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalForgotPasswordPage, {}))
}, {
  path: "/portal/reset-password",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalResetPasswordPage, {}))
}, {
  path: "/portal/admin",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminPage, {}))
}, {
  path: "/portal/admin/blog",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminBlogPage, {}))
}, {
  path: "/portal/admin/ai-content",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminAIContentPage, {}))
}, {
  path: "/portal/admin/wordpress-test",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminWordPressTestPage, {}))
}, {
  path: "/portal/admin/radius-dashboard",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminRadiusDashboardPage, {}))
}, {
  path: "/portal/admin/system-status",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminSystemStatusPage, {}))
}, {
  path: "/portal/admin/payment-dashboard",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminPaymentDashboardPage, {}))
}, {
  path: "/portal/admin/billing",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminBillingPage, {}))
}, {
  path: "/portal/admin/billing/:id",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminBillingDetailPage, {}))
}, {
  path: "/portal/admin/server-architecture",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalAdminServerArchPage, {}))
}, {
  path: "/portal/customer/dashboard",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalCustomerDashboardPage, {}))
}, {
  path: "/portal/billing/invoices",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalCustomerInvoicesPage, {}))
}, {
  path: "/system-check",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(SystemCheckPage, {}))
}, {
  path: "/radius-setup-guide",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(RadiusSetupGuide, {}))
}, {
  path: "/portal/technician",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalTechnicianPage, {}))
}, {
  path: "/portal/billing",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalBillingPage, {}))
}, {
  path: "/portal/support",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PortalSupportPage, {}))
}, {
  path: "/dashboard",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(HomePage, {}))
}, {
  path: "/customers",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(CustomersPage, {}))
}, {
  path: "/billing",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(BillingPage, {}))
}, {
  path: "/radius",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(RadiusPage, {}))
}, {
  path: "/devices",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(DevicesPage, {}))
}, {
  path: "/reports",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(ReportsPage, {}))
}, {
  path: "/settings",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {}))
}, {
  path: "/settings/wordpress",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(WordPressIntegrationPage, {}))
}, {
  path: "/payment",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PaymentPage, {}))
}, {
  path: "/internet-fiber-minimal",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(InternetFiberMinimalPage, {}))
}, {
  path: "/iot-solutions-minimal",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(IoTSolutionsMinimalPage, {}))
}, {
  path: "/layanan-digital-minimal",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(LayananDigitalMinimalPage, {}))
}, {
  path: "/privacy-minimal",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(PrivacyMinimalPage, {}))
}, {
  path: "/terms-minimal",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(TermsMinimalPage, {}))
}, {
  path: "*",
  element: w(/* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundPage, {}))
}];
const CookieBanner = reactExports.lazy(() => __vitePreload(() => import("./CookieBanner-0Wcl77mL.js"), true ? __vite__mapDeps([65,1,2,28,5]) : void 0).catch((error) => {
  console.warn("Failed to load CookieBanner:", error);
  return {
    default: () => null
  };
}));
const SpinnerFallback = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8 h-screen items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) });
const router = createBrowserRouter([{
  path: "/",
  element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(SpinnerFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RootLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) }),
  children: routes
}]);
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider2, { router }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CookieBannerErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CookieBanner, {}) }) })
  ] });
}
window.addEventListener("error", (event) => {
  var _a;
  if ((_a = event.message) == null ? void 0 : _a.includes("Failed to fetch dynamically imported module")) {
    console.error("Module loading error detected. Browser cache needs to be cleared.");
    const shouldRedirect = confirm("Browser cache perlu di-refresh. Klik OK untuk reload halaman.\n\nAtau tekan Ctrl+Shift+R (Windows/Linux) atau Cmd+Shift+R (Mac) untuk hard refresh.");
    if (shouldRedirect) {
      window.location.href = "/clear-cache.html";
    }
    event.preventDefault();
  }
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      // 5 minutes
      gcTime: 1e3 * 60 * 10,
      // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 0
    }
  }
});
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");
const root = ReactDOM.createRoot(rootElement);
root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(HelmetProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(React2.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) }) }));
