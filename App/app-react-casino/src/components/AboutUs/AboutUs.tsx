import { useEffect } from "react"

export function AboutUs() {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])


    return(
        <>
        <div className="mt-[100px] p-5 flex flex-col gap-5">
        <h1 className="text-2xl font-bold"> About UTimbaN </h1>
            <div className="text-[#918FB1] bg-[#23222F] p-5 rounded-[10px]"> 
            <p>Bienvenido a UTimbaN, el destino de entretenimiento en línea donde la emoción del juego y la diversión se encuentran. En UTimbaN, creemos que cada visita debe ser una experiencia única, repleta de adrenalina y grandes oportunidades.
            Fundado por un equipo de apasionados del juego, UTimbaN se ha diseñado para ofrecerte una plataforma atractiva y accesible. Nuestro objetivo es proporcionar a los jugadores una experiencia de casino virtual de alta calidad, con una amplia gama de juegos, promociones emocionantes y un ambiente seguro y fiable. </p>
            <h2 className="text-2xl md:text-3xl font-bold pt-5 "> Our Mission </h2>
            <p> En UTimbaN, nuestra misión es revolucionar la manera en que disfrutas de los casinos en línea. Nos comprometemos a brindarte un entorno de juego justo y divertido, donde cada jugador, nuevo o experimentado, pueda encontrar su lugar. Trabajamos incansablemente para mejorar nuestra plataforma y asegurarte que cada juego sea justo y transparente. </p>
            <h2 className="text-[#918FB1] text-2xl md:text-3xl font-bold pt-5 "> Games and Promotions </h2>
            <p> Explora nuestra variada selección de juegos, que incluye desde las clásicas tragamonedas hasta emocionantes mesas de póker y blackjack, todo optimizado para ofrecerte gráficos impresionantes y jugabilidad fluida. Además, ofrecemos promociones continuas para que siempre haya algo emocionante por descubrir </p>
            <h2 className="text-[#918FB1] text-2xl md:text-3xl font-bold pt-5 "> Commitment with security </h2>
            <p> La seguridad de nuestros jugadores es nuestra principal prioridad. En UTimbaN, utilizamos la tecnología más avanzada para garantizar que tu información esté protegida y tus transacciones sean seguras. Juega con tranquilidad, sabiendo que estamos aquí para cuidarte. </p>
            <h2 className="text-[#918FB1] text-2xl md:text-3xl font-bold pt-5 "> Join the UTimbaN experience </h2>
            <p> Te invitamos a unirte a nuestra emocionante comunidad de jugadores. Ya seas un novato o un experto, en UTimbaN encontrarás un lugar para disfrutar del juego como nunca antes. ¡Regístrate hoy y descubre todo lo que tenemos para ofrecerte! </p>
        </div>
        </div>
        </>
    )
}