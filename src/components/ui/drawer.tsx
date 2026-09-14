"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

function Drawer({ open, handleOnly = false, closeThreshold = 1 / 3, scrollLockTimeout = 0, fixed = true, repositionInputs = false, autoFocus = false, ...props }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>) {
  const isNonModal = props.modal === false;

  React.useEffect(() => {
    if (!open || !isNonModal) return;
    const background = document.querySelector<HTMLElement>("[data-drawer-background]");
    if (!background) return;

    const previousAriaHidden = background.getAttribute("aria-hidden");
    const revealBackground = () => {
      if (background.getAttribute("aria-hidden") === "true") background.removeAttribute("aria-hidden");
    };

    revealBackground();
    const observer = new MutationObserver(revealBackground);
    observer.observe(background, { attributes: true, attributeFilter: ["aria-hidden"] });

    return () => {
      observer.disconnect();
      if (previousAriaHidden === null) background.removeAttribute("aria-hidden");
      else background.setAttribute("aria-hidden", previousAriaHidden);
    };
  }, [isNonModal, open]);

  React.useEffect(() => {
    if (!open) return;
    const preventBackgroundScroll = (event: TouchEvent) => {
      if (event.target instanceof Element && event.target.closest(".drawer-content")) return;
      event.preventDefault();
    };
    document.addEventListener("touchmove", preventBackgroundScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventBackgroundScroll);
  }, [open]);
  return <DrawerPrimitive.Root open={open} handleOnly={handleOnly} closeThreshold={closeThreshold} scrollLockTimeout={scrollLockTimeout} fixed={fixed} repositionInputs={repositionInputs} autoFocus={autoFocus} {...props} />;
}
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerHandle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Handle>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Handle>
>(({ className = "", ...props }, ref) => <DrawerPrimitive.Handle ref={ref} className={`drawer-handle ${className}`} aria-label="Arraste para fechar" {...props} />);
DrawerHandle.displayName = DrawerPrimitive.Handle.displayName;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className = "", ...props }, ref) => <DrawerPrimitive.Overlay ref={ref} className={`drawer-overlay ${className}`} {...props} />);
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  scrollable?: boolean;
};

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ className = "", children, scrollable = false, ...props }, ref) => <DrawerPortal><DrawerOverlay /><DrawerPrimitive.Content ref={ref} className={`drawer-content ${scrollable ? "is-scrollable" : ""} ${className}`} {...props}><DrawerHandle />{scrollable ? <div className="drawer-scroll-area">{children}</div> : children}</DrawerPrimitive.Content></DrawerPortal>);
DrawerContent.displayName = DrawerPrimitive.Content.displayName;

function DrawerHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`drawer-header ${className}`} {...props} />; }
function DrawerTitle({ className = "", ...props }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>) { return <DrawerPrimitive.Title className={`drawer-title ${className}`} {...props} />; }
function DrawerDescription({ className = "", ...props }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>) { return <DrawerPrimitive.Description className={`drawer-description ${className}`} {...props} />; }

export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHandle, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger };
