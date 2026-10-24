import { Permission } from "@/../generated";

export function getPermissionLabel(permission: Permission): string {
  switch (permission) {
    case Permission.PHOTO_DELETE_OLD:
      return "Slette gamle bilder";
    case Permission.ALBUM_MANAGE:
      return "Albumadministrasjon";
    case Permission.ARCHIVE_MANAGE:
      return "Arkivadministrasjon";
    case Permission.POSITION_MANAGE:
      return "Vervadministrasjon";
    case Permission.USER_MANAGE:
      return "Brukeroppdateringer";
  }
}

export function getPermissionDescription(permission: Permission): string {
  switch (permission) {
    case Permission.PHOTO_DELETE_OLD:
      return "Kan slette bilder som er eldre enn 30 dager";
    case Permission.ALBUM_MANAGE:
      return "Kan opprette, redigere og slette album";
    case Permission.ARCHIVE_MANAGE:
      return "Kan gjøre ytterligere arkvirendringer som å oppdatere kategorier og steder";
    case Permission.POSITION_MANAGE:
      return "Kan opprette, redigere og slette verv, samt endre hvilke tilganger et verv har";
    case Permission.USER_MANAGE:
      return "Kan redigere brukere og legge til/fjerne verv";
  }
}
