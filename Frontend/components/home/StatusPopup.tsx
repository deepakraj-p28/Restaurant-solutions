import type { PopupSide } from "@/scripts/homepage";

type StatusPopupProps = {
  id: string;
  title: string;
  text: string;
  side: PopupSide;
};

export default function StatusPopup({ id, title, text, side }: StatusPopupProps) {
  return (
    <aside id={id} className={`home-status-popup home-status-popup--${side}`} role="status" aria-live="polite">
      <span className="home-status-popup__title">{title}</span>
      <span className="home-status-popup__text">{text}</span>
    </aside>
  );
}
