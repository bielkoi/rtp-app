import type { Metadata } from "next";
import { getSlides } from "@/lib/slides";
import SliderManager from "./slider-manager";

export const metadata: Metadata = { title: "Slider — RTP Admin" };

export default async function SliderSettingPage() {
  const slides = await getSlides();
  return <SliderManager slides={slides} />;
}
