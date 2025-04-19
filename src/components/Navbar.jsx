import React, { useEffect, useRef, useState } from "react"
import { TiLocationArrow } from "react-icons/ti"
import Button from "./Button"
import { useWindowScroll } from "react-use"
import { gsap } from "gsap"

const navItens = ["Nexus", "Vault", "Prolegue", "About", "Contact"]

const Navbar = () => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [isIndicatorActive, setIsIndicatorActive] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isNavVisible, setIsNavVisible] = useState(true)

    const navContainerRef = useRef()
    const audioElementRef = useRef()

    const { y: currentScrollY } = useWindowScroll()

    // Lógica para mostrar/ocultar a navbar com base no scroll
    useEffect(() => {
        if (currentScrollY === 0) {
            setIsNavVisible(true)
            navContainerRef.current?.classList.remove("floating-nav")
        } else if (currentScrollY > lastScrollY) {
            setIsNavVisible(false)
            navContainerRef.current?.classList.add("floating-nav")
        } else if (currentScrollY < lastScrollY) {
            setIsNavVisible(true)
            navContainerRef.current?.classList.add("floating-nav")
        }

        setLastScrollY(currentScrollY)
    }, [currentScrollY, lastScrollY])

    // Animação de transição da navbar
    useEffect(() => {
        if (navContainerRef.current) {
            gsap.to(navContainerRef.current, {
                y: isNavVisible ? 0 : -100,
                opacity: isNavVisible ? 1 : 0,
                duration: 0.2,
                ease: "power2.out",
            })
        }
    }, [isNavVisible])

    const toggleAudioIndicator = () => {
        const audio = audioElementRef.current
        if (audio) {
            if (isAudioPlaying) {
                audio.pause()
                setIsIndicatorActive(false)
            } else {
                audio.play()
                setIsIndicatorActive(true)
            }
            setIsAudioPlaying(!isAudioPlaying)
        }
    }

    return (
        <div
            ref={navContainerRef}
            className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
        >
            <header className="absolute top-1/2 w-full -translate-y-1/2">
                <nav className="flex w-full items-center justify-between px-6">
                    {/* ESQUERDA - LOGO + BOTÃO */}
                    <div className="flex items-center gap-7">
                        <img src="/img/logo.png" alt="logo" className="w-10" />

                        <Button
                            id="product-button"
                            title="Products"
                            rightIcon={<TiLocationArrow />}
                            containerClass="bg-blue-50 hidden md:flex items-center justify-center gap-1"
                        />
                    </div>

                    {/* DIREITA - LINKS + ÁUDIO */}
                    <div className="flex items-center gap-5">
                        <div className="hidden md:flex gap-5">
                            {navItens.map((item, index) => (
                                <a
                                    key={index}
                                    href={`#${item.toLowerCase()}`}
                                    className="nav-hover-btn"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        <button
                            className="ml-4 flex items-center space-x-0.5"
                            onClick={toggleAudioIndicator}
                        >
                            <audio
                                ref={audioElementRef}
                                className="hidden"
                                src="/audio/loop.mp3"
                                loop
                            />
                            {[1, 2, 3, 4].map((bar) => (
                                <div
                                    key={bar}
                                    className={`indicator-line ${
                                        isIndicatorActive ? "active" : ""
                                    }`}
                                    style={{ animationDelay: `${bar * 0.1}s` }}
                                ></div>
                            ))}
                        </button>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Navbar
