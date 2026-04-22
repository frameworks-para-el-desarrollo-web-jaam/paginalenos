const homeUrl = "http://localhost:5173/";
const whatsappUrl = "https://wa.me/";

function IconLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-300 bg-white/10 text-white transition hover:-translate-y-1 hover:bg-orange-500"
    >
      {children}
    </a>
  );
}

function ContactoSocial() {
  return (
    <section className="bg-gradient-to-b from-yellow-400 to-orange-200 px-4 py-20 text-stone-900">
      <div className="mx-auto max-w-6xl rounded-3xl bg-stone-900 px-8 py-12 text-white shadow-2xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
              Siguenos
            </p>
            <h2 className="mt-4 text-4xl font-bold">Encuentranos en redes sociales</h2>
            <p className="mt-4 text-lg text-stone-300">
              Facebook, Instagram y X te llevan a nuestra pagina principal por el momento.
            </p>
            <div className="mt-8 flex gap-4">
              <IconLink href={homeUrl} label="Facebook">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.6 1.6-1.6H16V4.8c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3V11H9v3h2.3v7h2.2Z" />
                </svg>
              </IconLink>
              <IconLink href={homeUrl} label="Instagram">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.45 1.35a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 1.8A2.4 2.4 0 1 0 14.4 12 2.4 2.4 0 0 0 12 9.6Z" />
                </svg>
              </IconLink>
              <IconLink href={homeUrl} label="X">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M18.9 3H21l-4.6 5.2L22 21h-4.4l-3.5-4.9L9.8 21H7.7l4.9-5.6L2 3h4.5l3.2 4.5L13.7 3h2.1l-4.9 5.6L18.9 3Zm-1.5 16.2H19L6.5 4.7H5l12.4 14.5Z" />
                </svg>
              </IconLink>
            </div>
          </div>

          <div className="rounded-3xl bg-orange-500 p-8 text-stone-950">
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">
              Contacto
            </p>
            <h3 className="mt-4 text-3xl font-bold">
              ¿Quieres hacer un pedido? Envianos un mensaje
            </h3>
            <p className="mt-4 text-lg">
              Estamos listos para atenderte por WhatsApp.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-stone-800"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M20.5 3.5A11 11 0 0 0 3.7 17.1L2 22l5.1-1.6A11 11 0 1 0 20.5 3.5ZM12 20.1a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3 .9 1-2.9-.2-.3A8.2 8.2 0 1 1 12 20.1Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.7-.2-.1-.4-.1-.6.1l-.5.7c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.4-1.8c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.2-.9.9-.9 2.1s.9 2.4 1 2.5c.1.2 1.8 2.8 4.5 3.9.6.3 1.2.5 1.6.6.7.2 1.3.1 1.8.1.6-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
              </svg>
              Ir a WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactoSocial;
