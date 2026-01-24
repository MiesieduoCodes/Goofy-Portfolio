"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface BentoGridItem {
  id: string
  title: string
  description: string
  image: string
  link: string
  tags?: string[]
  className?: string
}

interface BentoGridProps {
  items: BentoGridItem[]
  columns?: number
}

export function BentoGrid({ items, columns = 4 }: BentoGridProps) {
  // Create a more scattered, varied layout pattern for bento grid
  const getGridClass = (index: number) => {
    // More varied patterns with different sizes and positions - more scattered
    const patterns = [
      // Pattern 1: Extra Large Vertical, small, tall, small
      "md:col-span-2 md:row-span-3", // 0 - Extra Large Vertical
      "md:col-span-1 md:row-span-1", // 1 - Small
      "md:col-span-1 md:row-span-2", // 2 - Tall
      "md:col-span-1 md:row-span-1", // 3 - Small
      // Pattern 2: Wide horizontal, tall, large square, small
      "md:col-span-3 md:row-span-1", // 4 - Wide
      "md:col-span-1 md:row-span-2", // 5 - Tall
      "md:col-span-2 md:row-span-2", // 6 - Large Square
      "md:col-span-1 md:row-span-1", // 7 - Small
      // Pattern 3: Small, large, extra tall, small
      "md:col-span-1 md:row-span-1", // 8 - Small
      "md:col-span-2 md:row-span-2", // 9 - Large
      "md:col-span-1 md:row-span-3", // 10 - Extra Tall
      "md:col-span-1 md:row-span-1", // 11 - Small
      // Pattern 4: Medium wide, small, tall, small
      "md:col-span-2 md:row-span-1", // 12 - Medium Wide
      "md:col-span-1 md:row-span-1", // 13 - Small
      "md:col-span-1 md:row-span-2", // 14 - Tall
      "md:col-span-1 md:row-span-1", // 15 - Small
      // Pattern 5: Large wide, small, small, medium wide
      "md:col-span-3 md:row-span-2", // 16 - Large Wide
      "md:col-span-1 md:row-span-1", // 17 - Small
      "md:col-span-1 md:row-span-1", // 18 - Small
      "md:col-span-2 md:row-span-1", // 19 - Medium Wide
    ]
    return patterns[index % patterns.length]
  }

  const getItemType = (index: number) => {
    const pattern = index % 20
    if ([0, 6, 9, 16].includes(pattern)) return "large"
    if ([2, 5, 10, 14].includes(pattern)) return "tall"
    if ([4, 12, 19].includes(pattern)) return "wide"
    return "small"
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(200px,auto)]">
      {items.map((item, index) => {
        const itemType = getItemType(index)
        const isLarge = itemType === "large"
        const isWide = itemType === "wide"
        const isTall = itemType === "tall"
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={cn(
              "group relative overflow-hidden rounded-xl border-2 border-border bg-background transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10",
              getGridClass(index),
              item.className
            )}
          >
            <Card className="h-full border-0 bg-transparent">
              <CardContent className="relative h-full p-0">
                {/* Image */}
                <div className={cn(
                  "relative overflow-hidden",
                  isLarge ? "h-3/4" : isWide ? "h-1/2" : isTall ? "h-full" : "h-48"
                )}>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Tags overlay */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={cn(
                  "p-4",
                  isLarge && "p-6",
                  isWide && "p-5"
                )}>
                  <h3 className={cn(
                    "font-bold group-hover:text-primary transition-colors",
                    isLarge ? "text-2xl mb-2" : isWide ? "text-xl mb-2" : "text-lg mb-1"
                  )}>
                    {item.title}
                  </h3>
                  <p className={cn(
                    "text-muted-foreground",
                    isLarge ? "text-base mb-4 line-clamp-3" : isWide ? "text-sm mb-3 line-clamp-2" : "text-sm mb-3 line-clamp-2"
                  )}>
                    {item.description}
                  </p>
                  
                  {/* Tags list for large and wide items */}
                  {(isLarge || isWide) && item.tags && item.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    size={isLarge || isWide ? "default" : "sm"}
                    className="group/button w-full"
                  >
                    <Link href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined}>
                      View Project
                      {item.link.startsWith("http") ? (
                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                      ) : (
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                      )}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}


