import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  route("/", "views/App/App.tsx"),
  route("/motive/:id", "components/ImageViewer/MotiveHeader.tsx"),
  route("/about", "views/About/About.tsx"),
  route("/search/:term?", "views/Search/SearchMotive.tsx"),
  route("/photos", "views/Photos/Photos.tsx"),
  route("/login", "views/MobileLogin/MobileLogin.tsx"),
  layout("views/Layouts/InternProtectedRoute.tsx", [
    route("/intern/search", "views/InternSearch/InternSearchView.tsx"),
    layout("views/Layouts/FGProtectedRoute.tsx", [
      route("/fg", "views/Fg/FgNav/InternNav.tsx"),
      route("/fg/myprofile", "views/MyProfile/MyProfileRebrand.tsx"),
      route("/fg/projects", "views/Fg/NewProjects/NewProjects.tsx"),
      route("/fg/spillmeny", "views/Fg/NewProjects/SpillMeny.tsx"),
      route("/fg/firstgame", "views/Fg/NewProjects/Firstgame.tsx"),
      route("/fg/secondgame", "views/Fg/NewProjects/Secondgame.tsx"),
      route("/fg/markussittspill", "views/Fg/NewProjects/MarkusProject.tsx"),
      route("/fg/firstgamestarts", "views/Fg/NewProjects/FirstGameStarts.tsx"),
      route("/fg/upload", "views/Fg/PhotoUpload/PhotoUpload.tsx"),
      route("/fg/archiveBoss", "views/Fg/Arkivsjef/ArchiveBoss.tsx"),
      route(
        "/fg/archiveBoss/editUser/:id",
        "views/Fg/ArchiveBossEditUser/ArchiveBossEditUser.tsx",
      ),
      route("/fg/motive", "views/Fg/Motives/Motives.tsx"),
      route("/fg/motive/:id", "views/Fg/EditMotive/EditMotive.tsx"),
    ]),
  ]),
  route("/samf-wiki", "views/Redirects/SamfWikiRedirect.tsx"),
  route("/fg-wiki", "views/Redirects/FGWikiRedirect.tsx"),
  route("/ufs", "views/Redirects/UFSRedirect.tsx"),
  route("*", "views/NotFound/NotFound.tsx"),
] satisfies RouteConfig;
