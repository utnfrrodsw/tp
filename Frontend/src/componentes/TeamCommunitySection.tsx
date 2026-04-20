import React from 'react';
import { motion } from 'framer-motion';

interface TeamMember {
  handle: string;
  name: string;
  role: string;
  bio: string;
  avatarSrc?: string;
  avatarAlt: string;
  accent: string;
  questionAvatar?: boolean;
}

const members: TeamMember[] = [
  {
    handle: '@agus',
    name: 'Agus',
    role: 'Dev',
    bio: 'Me gusta leer manga, manwha y novelas ligeras. En BookCode me encargo de la parte visual y de que todo se vea lindo.',
    avatarSrc: '/assets/avatar4.svg',
    avatarAlt: 'Avatar de Agus',
    accent: 'from-pink-500 to-fuchsia-600',
  },
  {
    handle: '@joa',
    name: 'Joa',
    role: 'Dev',
    bio: 'Me encargo del backend para que todo funcione como corresponda, desde el manejo de tokens hasta el cifrado seguro de contraseñas.',
    avatarSrc: '/assets/avatar6.svg',
    avatarAlt: 'Avatar de Joa',
    accent: 'from-violet-500 to-purple-600',
  },
  {
    handle: '@nahue',
    name: 'Nahue',
    role: 'Dev',
    bio: 'Me gustan los libros de desarrollo personal y aportar esa mirada para mejorar la experiencia dentro de BookCode.',
    avatarSrc: '/assets/avatar2.svg',
    avatarAlt: 'Avatar de Nahue',
    accent: 'from-blue-500 to-cyan-600',
  },
  {
    handle: '@joaquin',
    name: 'Joaquin',
    role: 'Dev',
    bio: 'Me gusta analizar el mercado y leer libros de tradeo, aplicando esa perspectiva para tomar mejores decisiones en el proyecto.',
    avatarSrc: '/assets/avatar5.svg',
    avatarAlt: 'Avatar de Joaquin',
    accent: 'from-emerald-500 to-lime-600',
  },
  {
    handle: '@piu-piu',
    name: 'Piu Piu',
    role: 'Mascota',
    bio: 'Piu Piu es el que mas labura, trae ideas random y mucha energia para que BookCode siempre tenga magia.',
    avatarSrc: '/assets/avatar1.svg',
    avatarAlt: 'Avatar de Piu Piu',
    accent: 'from-yellow-400 to-amber-500',
  },
  {
    handle: '@you',
    name: 'Tu lugar',
    role: 'Miembro de la comunidad',
    bio: 'BookCode crece con gente que ama leer, reseñar y compartir. Si queres sumarte, este espacio tambien es tuyo.',
    questionAvatar: true,
    avatarAlt: 'Avatar de You',
    accent: 'from-violet-500 to-purple-600',
  },
];

export const TeamCommunitySection: React.FC = () => {
  return (
    <section
      aria-label="Conoce al equipo"
      className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950"
    >
      <div className="absolute inset-0 opacity-35 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.35),transparent_32%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <span className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-200 mb-4">
            Nuestro equipo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            Saluda al equipo
          </h2>
          <p className="mt-3 max-w-4xl text-slate-300/95 text-base md:text-lg leading-relaxed">
            BookCode es un proyecto creado por un grupo chico de personas apasionadas por los libros.
            Creemos que una comunidad activa puede generar un impacto enorme en la forma en que descubrimos historias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.article
              key={member.handle}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group rounded-2xl border border-slate-700/70 bg-slate-900/70 backdrop-blur-sm p-5 md:p-6 shadow-[0_12px_30px_rgba(2,6,23,0.35)] hover:border-cyan-300/35 hover:shadow-[0_16px_40px_rgba(14,165,233,0.2)] transition-all duration-300"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.accent} p-[2px] shadow-lg ring-1 ring-white/20 group-hover:ring-cyan-200/60 transition-all duration-300`}>
                  {member.questionAvatar ? (
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-lg">
                      ?
                    </div>
                  ) : (
                    <img
                      src={member.avatarSrc}
                      alt={member.avatarAlt}
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div>
                  <p className="text-cyan-300 text-sm font-semibold leading-none">{member.handle}</p>
                  <h3 className="mt-1 text-white text-[2rem] font-bold leading-none">{member.name}</h3>
                  <p className="mt-1 text-slate-400 text-sm font-medium tracking-wide">{member.role}</p>
                </div>
              </div>
              <p className="text-slate-300/95 text-[1.05rem] leading-relaxed">{member.bio}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamCommunitySection;
