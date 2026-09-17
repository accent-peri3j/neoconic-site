import { ArrowDown } from "lucide-react";
import "./curacao-arrow.css";

/** Shared decorative arrow; its parent link or button provides the accessible label. */
export function CuracaoArrow() {
  return (
    <ArrowDown className="cw-arrow-icon" aria-hidden="true" focusable="false" size={16} strokeWidth={1.25} />
  );
}
