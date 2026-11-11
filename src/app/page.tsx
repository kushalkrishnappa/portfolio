import FieldManual from "@/app/components/manual/FieldManual";

export default function Home() {
  // Appendices (A Parts list · B Specifications · C Field notes, with blog posts
  // fetched here on the server) plug into FieldManual's `appendices` slot.
  return <FieldManual />;
}
