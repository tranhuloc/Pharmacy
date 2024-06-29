import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import AboutView from "../views/LandingPages/AboutUs/AboutView.vue";
import ContactView from "../views/LandingPages/ContactUs/ContactView.vue";
import AuthorView from "../views/LandingPages/Author/AuthorView.vue";
import SignInView from "../views/Auth/SignInView.vue";
import SignUpView from "../views/Auth/SignUpView.vue";
import CartView from "../views/Cart/CartView.vue";
import PageHeaders from "../layouts/sections/page-sections/page-headers/HeadersView.vue";
import PageFeatures from "../layouts/sections/page-sections/features/FeaturesView.vue";
import NavigationNavbars from "../layouts/sections/navigation/navbars/NavbarsView.vue";
import NavigationNavTabs from "../layouts/sections/navigation/nav-tabs/NavTabsView.vue";
import NavigationPagination from "../layouts/sections/navigation/pagination/PaginationView.vue";
import InputAreasInputs from "../layouts/sections/input-areas/inputs/InputsView.vue";
import InputAreasForms from "../layouts/sections/input-areas/forms/FormsView.vue";
import ACAlerts from "../layouts/sections/attention-catchers/alerts/AlertsView.vue";
import ACModals from "../layouts/sections/attention-catchers/modals/ModalsView.vue";
import ACTooltipsPopovers from "../layouts/sections/attention-catchers/tooltips-popovers/TooltipsPopoversView.vue";
import ElAvatars from "../layouts/sections/elements/avatars/AvatarsView.vue";
import ElBadges from "../layouts/sections/elements/badges/BadgesView.vue";
import ElBreadcrumbs from "../layouts/sections/elements/breadcrumbs/BreadcrumbsView.vue";
import ElButtons from "../layouts/sections/elements/buttons/ButtonsView.vue";
import ElButtonGroups from "../layouts/sections/elements/button-groups/ButtonGroupsView.vue";
import ElDropdowns from "../layouts/sections/elements/dropdowns/DropdownsView.vue";
import ElProgressBars from "../layouts/sections/elements/progress-bars/ProgressBarsView.vue";
import ElToggles from "../layouts/sections/elements/toggles/TogglesView.vue";
import ElTypography from "../layouts/sections/elements/typography/TypographyView.vue";

import CollectionView from "../views/Collection/CollectionView.vue";
import DetailView from "../views/Detail/DetailView.vue";
import ManagePurchaseView from "../views/ManagePurchase/ManagePurchaseView.vue";
import ManageProfileView from "../views/Auth/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: PresentationView,
    },
    {
      path: "/login",
      name: "page-signin",
      component: SignInView,
    },
    {
      path: "/register",
      name: "page-signup",
      component: SignUpView,
    },
    {
      path: "/detail/:id",
      name: "page-detail",
      component: DetailView,
    },
    {
      path: "/collection/:collection_name",
      name: "page-collection",
      component: CollectionView,
    },
    {
      path: "/search/:keyword_search",
      name: "page-search",
      component: CollectionView,
    },
    {
      path: "/search/:supplier_name/:active_ingredient",
      name: "page-search-options",
      component: CollectionView,
    },
    {
      path: "/product-pharmacy/:pharmacy_name",
      name: "page-product-pharmacy",
      component: CollectionView,
    },
    {
      path: "/cart",
      name: "page-cart",
      component: CartView,
    },
    {
      path: "/purchase",
      name: "page-purchase",
      component: ManagePurchaseView,
    },
    {
      path: "/profile",
      name: "page-profile",
      component: ManageProfileView,
    },
  ],
});

export default router;
