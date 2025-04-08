"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Slider } from "@/components/ui/slider"

// Drum performances data
const performances = [
  {
    id: 1,
    title: "Live at The Blue Note",
    date: "2023-08-15",
    venue: "The Blue Note, New York",
    description: "A jazz fusion performance with the John Smith Quartet.",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/placeholder-audio.mp3",
  },
  {
    id: 2,
    title: "Summer Festival",
    date: "2023-07-04",
    venue: "Central Park, New York",
    description: "An outdoor performance featuring original compositions.",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/placeholder-audio.mp3",
  },
  {
    id: 3,
    title: "Studio Session",
    date: "2023-06-10",
    venue: "Skyline Studios, Los Angeles",
    description: "Recording session for the upcoming album 'Rhythmic Journey'.",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/placeholder-audio.mp3",
  },
  {
    id: 4,
    title: "Collaboration with Sarah Johnson",
    date: "2023-05-22",
    venue: "The Fillmore, San Francisco",
    description: "A special performance with acclaimed vocalist Sarah Johnson.",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/placeholder-audio.mp3",
  },
]

// Drum kit components
const drumKitParts = [
  {
    name: "Snare Drum",
    description: 'Pearl Masters Maple Complete 14"x5.5" snare drum with die-cast hoops.',
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Bass Drum",
    description: 'Pearl Masters Maple Complete 22"x18" bass drum with EMAD batter head.',
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Tom Toms",
    description: 'Pearl Masters Maple Complete 10", 12", and 16" toms with Remo Emperor heads.',
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Hi-Hat",
    description: 'Zildjian K Custom 14" hi-hat cymbals with Pearl eliminator pedal.',
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Ride Cymbal",
    description: 'Zildjian K Custom 22" ride cymbal with complex overtones.',
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Crash Cymbals",
    description: 'Zildjian A Custom 16" and 18" crash cymbals for accents and transitions.',
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState("performances")
  const [currentAudio, setCurrentAudio] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const audioRef = useRef(null)

  const handlePlayPause = (audioSrc) => {
    if (currentAudio === audioSrc && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (currentAudio !== audioSrc) {
        setCurrentAudio(audioSrc)
        if (audioRef.current) {
          audioRef.current.src = audioSrc
          audioRef.current.load()
        }
      }
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (value) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} src={currentAudio} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted pt-16 md:pt-24">
        <div className="container flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Music & Drumming</h1>
          </motion.div>

          <AnimatedText
            text="Creating rhythms and beats that move people and enhance musical experiences"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />
        </div>
      </section>

      {/* Featured Video */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Performance</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              Watch my latest drum performance at the Jazz Festival
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 overflow-hidden rounded-lg border"
        >
          <div className="relative aspect-video w-full bg-muted">
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground">Video player placeholder</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Play className="h-8 w-8" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tabs Section */}
      <section className="container">
        <Tabs defaultValue="performances" value={activeTab} onValueChange={setActiveTab}>
          <ScrollReveal>
            <TabsList className="mb-8 w-full justify-start overflow-auto">
              <TabsTrigger value="performances">Performances</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="influences">Influences</TabsTrigger>
            </TabsList>
          </ScrollReveal>

          {/* Performances Tab */}
          <TabsContent value="performances" className="mt-0">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {performances.map((performance, index) => (
                <ScrollReveal key={performance.id} delay={0.1 * index}>
                  <Card className="overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={performance.image || "/placeholder.svg"}
                        alt={performance.title}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold">{performance.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {performance.venue} • {new Date(performance.date).toLocaleDateString()}
                      </p>
                      <p className="mt-2">{performance.description}</p>

                      <div className="mt-4 flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePlayPause(performance.audio)}
                          className="h-10 w-10 rounded-full"
                        >
                          {currentAudio === performance.audio && isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </Button>

                        <div className="flex flex-1 items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            min={0}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                            className="w-24"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {drumKitParts.map((part, index) => (
                <ScrollReveal key={part.name} delay={0.1 * index}>
                  <Card className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={part.image || "/placeholder.svg"}
                        alt={part.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold">{part.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{part.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </TabsContent>

          {/* Influences Tab */}
          <TabsContent value="influences" className="mt-0">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                {
                  name: "Tony Williams",
                  description:
                    "Revolutionary jazz drummer known for his work with Miles Davis and his innovative approach to rhythm.",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Buddy Rich",
                  description: "Legendary drummer known for his incredible technique, speed, and showmanship.",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Steve Gadd",
                  description: "Versatile session drummer known for his precise grooves and influential patterns.",
                  image: "/placeholder.svg?height=400&width=400",
                },
                {
                  name: "Vinnie Colaiuta",
                  description:
                    "Technical virtuoso known for his work with Frank Zappa and Sting, and his complex polyrhythms.",
                  image: "/placeholder.svg?height=400&width=400",
                },
              ].map((influence, index) => (
                <ScrollReveal key={influence.name} delay={0.1 * index}>
                  <Card className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="aspect-square md:col-span-1">
                        <Image
                          src={influence.image || "/placeholder.svg"}
                          alt={influence.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6 md:col-span-2">
                        <h3 className="text-xl font-bold">{influence.name}</h3>
                        <p className="mt-2">{influence.description}</p>
                      </CardContent>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Upcoming Performances */}
      <section className="bg-muted py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Upcoming Performances</h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground">Catch me live at these upcoming events</p>
            </div>
          </ScrollReveal>

          <div className="mt-12 space-y-6">
            {[
              {
                date: "2023-12-15",
                venue: "Blue Note Jazz Club",
                location: "New York, NY",
                time: "8:00 PM",
                ticketLink: "#",
              },
              {
                date: "2024-01-20",
                venue: "The Jazz Gallery",
                location: "New York, NY",
                time: "7:30 PM",
                ticketLink: "#",
              },
              {
                date: "2024-02-10",
                venue: "SF Jazz Center",
                location: "San Francisco, CA",
                time: "8:00 PM",
                ticketLink: "#",
              },
            ].map((event, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <Card>
                  <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                    <div>
                      <div className="text-sm font-medium text-primary">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <h3 className="text-xl font-bold">{event.venue}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.location} • {event.time}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={event.ticketLink}>
                        Get Tickets
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <Card className="border-none bg-gradient-to-r from-primary/20 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Interested in Collaboration?</h2>
              <p className="max-w-[600px] text-muted-foreground">
                I'm always open to new musical collaborations and performance opportunities. Let's create something
                amazing together!
              </p>
            </ScrollReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Button size="lg" asChild className="mt-4">
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

