"use client";
import Image from "next/image";
import { useRef, useState } from "react";

const ZOOM_MIN = 2;

const ProductLeft = ({ selectedImage }: { selectedImage: string }) => {
  const figureRef = useRef<HTMLElement>(null);
  const zoomImgRef = useRef<HTMLImageElement>(null);
  const [zooming, setZooming] = useState(false);
  const canZoom = Boolean(selectedImage);

  const lastPos = useRef({ x: 0, y: 0 });
  const pan = (clientX: number, clientY: number) => {
    lastPos.current = { x: clientX, y: clientY };
    const fig = figureRef.current;
    const img = zoomImgRef.current;
    if (!fig || !img || !img.naturalWidth) return;

    const box = fig.getBoundingClientRect();
    const scale = Math.max(ZOOM_MIN, img.naturalWidth / box.width);
    const w = box.width * scale;
    const h = (img.naturalHeight / img.naturalWidth) * w;
    img.style.width = `${w}px`;
    img.style.height = `${h}px`;

    const fx = Math.min(Math.max((clientX - box.left) / box.width, 0), 1);
    const fy = Math.min(Math.max((clientY - box.top) / box.height, 0), 1);
    // If the zoomed image is still smaller than the box on an axis, centre it.
    const x = w > box.width ? -fx * (w - box.width) : (box.width - w) / 2;
    const y = h > box.height ? -fy * (h - box.height) : (box.height - h) / 2;
    img.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleEnter = (e: React.MouseEvent) => {
    if (!canZoom || !window.matchMedia("(hover: hover)").matches) return;
    setZooming(true);
    requestAnimationFrame(() => pan(e.clientX, e.clientY));
  };

  return (
    <div className=" product-left flex flex-col w-full [grid-area:image]">
      <div className="flex flex-col gap-[10px] border">
        <figure
          ref={figureRef}
          onMouseEnter={handleEnter}
          onMouseMove={(e) => zooming && pan(e.clientX, e.clientY)}
          onMouseLeave={() => setZooming(false)}
          className="relative overflow-hidden rounded-md sm:mt-0 flex items-center justify-center
          w-full lg:h-[35rem] lg:w-[100%] xl:w-[100%]  2xl:w-[100%] xl:h-[41.5rem]
           p-1 bg-[#FFF]"
        >
          <Image
            src={selectedImage || "/default-product-image.svg"}
            alt="Main product image"
            className="object-contain rounded-lg"
            width={500}
            height={500}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            quality={85}
            placeholder={selectedImage ? undefined : "blur"}
            blurDataURL={
              selectedImage ? undefined : "/default-product-image.svg"
            }
          />

          {/* Zoom layer: original-resolution image, panned in pan() */}
          {zooming && (
            <div className="absolute inset-0 z-10 bg-white" aria-hidden="true">
              <img
                ref={zoomImgRef}
                src={selectedImage}
                alt=""
                draggable={false}
                onLoad={() => pan(lastPos.current.x, lastPos.current.y)}
                className="absolute left-0 top-0 max-w-none select-none pointer-events-none"
              />
            </div>
          )}
        </figure>

        <figcaption className="flex justify-center text-[14px] text-[#808080] items-start h-[5.1rem] xl:w-[100%] 2xl:w-[100%] xl:h-[10.7rem] text-center">
          Image may differ from the actual product
        </figcaption>
      </div>
    </div>
  );
};

export default ProductLeft;
