import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://i.pinimg.com/736x/79/3e/e8/793ee837f3cd2bc66fe0fd2cc67c93d7.jpg",
    title: "Pollo a la leña con presencia",
    description:
      "Crujiente por fuera, jugoso por dentro y servido como un verdadero protagonista de la mesa.",
  },
  {
    image:
      "https://tse4.mm.bing.net/th/id/OIP.O93r2xl-46oHRvdlt8quSQHaE8?w=640&h=428&rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "Combos para compartir",
    description:
      "Perfectos para reuniones familiares, celebraciones y antojos que se disfrutan mejor en compañia.",
  },
  {
    image:
      "https://tse3.mm.bing.net/th/id/OIP.U5P_I0fW08tSRmXxnIXhUgHaE8?w=1440&h=960&rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "Platos a la carta memorables",
    description:
      "Opciones caseras, abundantes y listas para quienes quieren algo especial mas alla del clasico.",
  },
  {
    image:
      "https://misrecetasdecocina.net/wp-content/uploads/2018/01/Receta-de-pan-relleno-848x477.jpg",
    title: "Acompañamientos con personalidad",
    description:
      "Sabores que completan cada pedido y convierten el menu en una experiencia mas variada.",
  },
  {
    image:
      "https://tse4.mm.bing.net/th/id/OIP.7LtSqB91QSSWx-Jv6wY1HgHaEK?w=570&h=320&rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "Presentacion que abre el apetito",
    description:
      "Cada imagen cuenta una historia de horno, brasas y platos pensados para antojar a primera vista.",
  },
];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[currentIndex];

  return (
    <section className="bg-gradient-to-b from-orange-50 via-amber-50 to-white px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">
              Galeria de sabor
            </p>
            <h2 className="mt-4 text-4xl font-black text-stone-900 md:text-5xl">
              Nuestros leños y platos se lucen como saben.
            </h2>
            <p className="mt-4 text-lg leading-8 text-stone-600">
              Un recorrido visual por lo mejor de nuestra cocina: brasas, color,
              textura y antojo en cada toma.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={prevSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 bg-white text-2xl text-stone-800 shadow-sm transition hover:border-orange-500 hover:text-orange-500"
            >
              �
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 bg-white text-2xl text-stone-800 shadow-sm transition hover:border-orange-500 hover:text-orange-500"
            >
              �
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-stone-950 shadow-2xl">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="h-[420px] w-full object-cover md:h-[540px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="max-w-2xl rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md md:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
                  Destacado {String(currentIndex + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-3xl font-bold text-white">
                  {currentSlide.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-stone-200">
                  {currentSlide.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`flex items-center gap-4 rounded-[1.5rem] border p-4 text-left transition ${
                  index === currentIndex
                    ? "border-orange-400 bg-stone-900 text-white shadow-xl"
                    : "border-stone-200 bg-white text-stone-800 shadow-sm hover:border-orange-300"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.25em] ${
                      index === currentIndex ? "text-orange-300" : "text-orange-500"
                    }`}
                  >
                    Slide {String(index + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-2 text-lg font-bold">{slide.title}</h4>
                  <p
                    className={`mt-1 text-sm leading-6 ${
                      index === currentIndex ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {slide.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Carousel;
