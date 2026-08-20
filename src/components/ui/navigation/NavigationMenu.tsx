import * as React from "react";
import { ArrowUpRight, ChevronDownIcon, ChevronRight } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import styles from "./NavigationMenu.module.css";
import { Link, LinkProps } from "@tanstack/react-router";

export function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={[styles.navigationMenuRoot, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

export function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={[styles.navigationMenuList, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={[styles.navigationMenuItem, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function NavigationMenuTrigger({
  className,
  children,
  active,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & {
  active?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      data-active={active ? "" : undefined}
      className={[styles.navigationMenuTrigger, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className={styles.navigationMenuChevron}
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

type InternalLinkProps = Omit<LinkProps, "children">;
type ExternalLinkProps = {
  href: string;
};

export function NavigationSubMenuLink({
  className,
  icon,
  subtext,
  chevron,
  link,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  icon?: React.ReactNode;
  subtext?: string;
  link: InternalLinkProps | ExternalLinkProps;
  chevron?: "link" | "externalLink";
}) {
  const isInternalLink = "to" in link;

  if (isInternalLink) {
    return (
      <NavigationMenuPrimitive.Link
        data-slot="navigation-menu-link"
        asChild
        className={[styles.navigationSubMenuLink, className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <Link
          {...link}
          activeOptions={{ exact: true, includeSearch: false, ...link.activeOptions }}
          className={styles.navigationSubMenuLinkWrapper}
        >
          <NavigationSubMenuContent
            icon={icon}
            subtext={subtext}
            chevron={chevron}
          >
            {children}
          </NavigationSubMenuContent>
        </Link>
      </NavigationMenuPrimitive.Link>
    );
  }

  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      asChild
      className={[styles.navigationSubMenuLink, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <a href={link.href} className={styles.navigationSubMenuLinkWrapper}>
        <NavigationSubMenuContent
          icon={icon}
          subtext={subtext}
          chevron={chevron}
        >
          {children}
        </NavigationSubMenuContent>
      </a>
    </NavigationMenuPrimitive.Link>
  );
}

function NavigationSubMenuContent({
  icon,
  subtext,
  chevron,
  children,
}: {
  icon?: React.ReactNode;
  subtext?: string;
  chevron?: "link" | "externalLink";
  children: React.ReactNode;
}) {
  return (
    <>
      {icon && (
        <div className={styles.navigationSubMenuLinkIconWrapper}>{icon}</div>
      )}
      <div className={styles.navigationSubMenuLinkTextWrapper}>
        <div className={styles.navigationSubMenuLinkTextHeader}>{children}</div>
        {subtext && (
          <div className={styles.navigationSubMenuLinkTextSubtext}>
            {subtext}
          </div>
        )}
      </div>
      {chevron && (
        <div className={styles.navigationSubMenuChevron}>
          {chevron === "link" ? <ChevronRight /> : <ArrowUpRight />}
        </div>
      )}
    </>
  );
}

export function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={[styles.navigationMenuContent, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => {
  return (
    <div className={styles.navigationMenuViewportWrapper}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        ref={ref}
        className={[styles.navigationMenuViewportContent, className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

export function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={[styles.navigationMenuLink, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
