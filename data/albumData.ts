import type { Album } from "@/types/album"

export const albumData: Album[] = [
  {
    id: "1",
    title: "Sample Models",
    description: "Working GLB models for Filament",
    images: [
      {
        id: "s1",
        title: "Duck",
        thumbnail: "/placeholder.svg?height=120&width=120",
        targetImage: "/placeholder.svg?height=120&width=120",
        modelUrl:
          "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
        info: {
          name: "Duck Model",
          designer: "Khronos Group",
          year: "2023",
          materials: "PBR Materials",
          dimensions: "Standard GLB",
          description:
            "Official Khronos Group sample model. A simple yellow duck with PBR materials optimized for Filament rendering.",
        },
      },
      {
        id: "s2",
        title: "Box",
        thumbnail: "/placeholder.svg?height=120&width=120",
        targetImage: "/placeholder.svg?height=120&width=120",
        modelUrl:
          "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb",
        info: {
          name: "Simple Box",
          designer: "Khronos Group",
          year: "2023",
          materials: "Basic Material",
          dimensions: "1x1x1 units",
          description: "A simple textured box model for testing basic GLB loading with Filament renderer.",
        },
      },
      {
        id: "s3",
        title: "Avocado",
        thumbnail: "/placeholder.svg?height=120&width=120",
        targetImage: "/placeholder.svg?height=120&width=120",
        modelUrl:
          "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
        info: {
          name: "Avocado Model",
          designer: "Khronos Group",
          year: "2023",
          materials: "PBR Materials",
          dimensions: "Realistic scale",
          description:
            "Detailed avocado model with realistic PBR materials and textures, perfect for testing Filament's material system.",
        },
      },
    ],
  },
  {
    id: "2",
    title: "Animated Models",
    description: "Models with animations",
    images: [
      {
        id: "a1",
        title: "Animated Box",
        thumbnail: "/placeholder.svg?height=120&width=120",
        targetImage: "/placeholder.svg?height=120&width=120",
        modelUrl:
          "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb",
        info: {
          name: "Animated Box",
          designer: "Khronos Group",
          year: "2023",
          materials: "Animated Material",
          dimensions: "1x1x1 units",
          description: "A box with rotation animation to test GLB animation support in Filament.",
        },
      },
      {
        id: "a2",
        title: "Cesium Man",
        thumbnail: "/placeholder.svg?height=120&width=120",
        targetImage: "/placeholder.svg?height=120&width=120",
        modelUrl:
          "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb",
        info: {
          name: "Cesium Man",
          designer: "Cesium",
          year: "2023",
          materials: "Character Materials",
          dimensions: "Human scale",
          description: "Animated character model with walking animation, showcasing Filament's animation capabilities.",
        },
      },
    ],
  },
  {
    id: "3",
    title: "Complex Models",
    description: "Advanced models with multiple features",
    images: [
      {
        id: "c1",
        title: "Damaged Helmet",
        thumbnail: "/placeholder.svg?height=120&width=120",
        targetImage: "/placeholder.svg?height=120&width=120",
        modelUrl:
          "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
        info: {
          name: "Damaged Helmet",
          designer: "Khronos Group",
          year: "2023",
          materials: "PBR with Normal Maps",
          dimensions: "Helmet scale",
          description: "Complex sci-fi helmet with detailed PBR materials, normal maps, and weathering effects.",
        },
      },
      {
        id: "c2",
        title: "Flight Helmet",
        thumbnail: "/placeholder.svg?height=120&width=120",
        targetImage: "/placeholder.svg?height=120&width=120",
        modelUrl:
          "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF-Binary/FlightHelmet.glb",
        info: {
          name: "Flight Helmet",
          designer: "Khronos Group",
          year: "2023",
          materials: "Complex PBR",
          dimensions: "Real scale",
          description: "Highly detailed flight helmet with complex materials and multiple texture maps.",
        },
      },
    ],
  },
]
