import { CONTACT } from "@/lib/site";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, "")}`}>{CONTACT.phonePrimary}</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
        <div className="topbar-right">Mon - Sun: 24/7 Available</div>
      </div>
    </div>
  );
}
