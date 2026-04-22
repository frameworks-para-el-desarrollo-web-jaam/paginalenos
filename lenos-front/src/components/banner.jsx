import { Link } from "react-router-dom";

function Banner() {
  return (
    <section className="relative overflow-hidden bg-stone-950 px-4 pb-16 pt-10 text-white">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://i.pinimg.com/736x/79/3e/e8/793ee837f3cd2bc66fe0fd2cc67c93d7.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.35),_transparent_35%),linear-gradient(135deg,rgba(17,24,39,0.92),rgba(68,26,3,0.82))]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="py-8 lg:py-14">
          <p className="inline-flex rounded-full border border-orange-300/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-orange-200">
            Desde 2026 en Dolores Hidalgo
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight text-orange-50 md:text-6xl xl:text-7xl">
            El sabor a la leña que convierte una comida en recuerdo.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200 md:text-xl">
            Leños rellenos de sabor,tradicion y antojo. Cada plato es un viaje a la escencia de la comida.
            Descubre un catalogo hecho para antojar desde la primera mirada.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/catalogo"
              className="rounded-full bg-orange-500 px-7 py-4 text-center font-bold text-stone-950 transition hover:bg-orange-400"
            >
              Explorar catalogo
            </Link>
            <Link
              to="/carrito"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-4 text-center font-bold text-white transition hover:bg-white hover:text-stone-950"
            >
              Ver carrito
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-3xl font-black text-orange-300">2026</p>
              <p className="mt-1 text-sm text-stone-200">Año en que iniciamos nuestra historia.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-3xl font-black text-orange-300">+1000</p>
              <p className="mt-1 text-sm text-stone-200">Comensales que ya conocen nuestro sabor.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-3xl font-black text-orange-300">100%</p>
              <p className="mt-1 text-sm text-stone-200">Antojo garantizado al mirar el menu.</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-6 top-8 hidden h-40 w-40 rounded-full bg-orange-400/30 blur-3xl md:block" />
          <div className="absolute -bottom-8 right-0 hidden h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl md:block" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <img
              src="https://tse3.mm.bing.net/th/id/OIP.U5P_I0fW08tSRmXxnIXhUgHaE8?w=1440&h=960&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Plato estrella"
              className="h-[420px] w-full rounded-[1.5rem] object-cover"
            />

            <div className="absolute bottom-8 left-8 right-8 rounded-[1.5rem] bg-stone-950/75 p-5 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
                Recomendado
              </p>
              <h2 className="mt-2 text-2xl font-bold text-orange-50">
                Nuestros leños mas pedidos
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                Una presentacion intensa, casera y jugosa para quienes quieren
                comer rico desde el primer bocado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
