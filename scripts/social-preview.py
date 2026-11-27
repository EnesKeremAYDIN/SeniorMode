"""Generate the SeniorMode social preview with Pillow."""
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "assets" / "brand"
FONT_DIRS = (
    Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts",
    Path("/usr/share/fonts/truetype/dejavu"),
    Path("/System/Library/Fonts/Supplemental"),
)
PALETTE = {
    "background": "#101412", "panel": "#19211C", "border": "#354239",
    "text": "#F1F7F2", "muted": "#A9BCB0", "lime": "#A6EB75",
};


def font(size, bold=False):
    names = ("seguisb.ttf", "DejaVuSans-Bold.ttf", "Arial Bold.ttf") if bold else (
        "segoeui.ttf", "DejaVuSans.ttf", "Arial.ttf"
    )
    for folder in FONT_DIRS:
        for name in names:
            path = folder / name
            if path.is_file():
                return ImageFont.truetype(str(path), size)
    return ImageFont.load_default(size=size)


def social_preview():
    art = Image.new("RGB", (1280, 640), PALETTE["background"])
    draw = ImageDraw.Draw(art)
    draw.rectangle((0, 0, 1280, 10), fill=PALETTE["lime"])
    draw.rounded_rectangle((72, 67, 147, 142), 14, fill=PALETTE["panel"], outline=PALETTE["border"], width=2)
    for line in (
        ((101, 94), (91, 104), (101, 115)), ((118, 94), (128, 104), (118, 115)),
        ((105, 117), (114, 92)),
    ):
        draw.line(line, fill=PALETTE["lime"], width=4, joint="curve")
    draw.text((168, 83), "SeniorMode", font=font(31, True), fill=PALETTE["text"])
    draw.text((72, 190), "Your AI can code.", font=font(77, True), fill=PALETTE["text"])
    draw.text((72, 285), "Now make it engineer.", font=font(77, True), fill=PALETTE["lime"])
    draw.text((76, 402), "Real-world engineering knowledge for AI coding agents.", font=font(31), fill=PALETTE["muted"])
    for index, label in enumerate(("Request", "Engineering decision", "Verified behavior")):
        x = 75 + index * 380
        draw.rounded_rectangle((x, 505, x + 340, 562), 13, fill=PALETTE["panel"], outline=PALETTE["border"])
        draw.ellipse((x + 19, 528, x + 28, 537), fill=PALETTE["lime"])
        draw.text((x + 41, 519), label, font=font(24, True), fill=PALETTE["text"])
        if index < 2:
            draw.line((x + 349, 533, x + 370, 533), fill=PALETTE["lime"], width=2)
    BRAND.mkdir(exist_ok=True, parents=True)
    art.save(BRAND / "social-preview.png", optimize=True)


if __name__ == "__main__":
    social_preview()
    print("Generated the SeniorMode social preview.")
