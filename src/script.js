import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/Addons.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'



/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')


// Set colourspace property since poly haven stores color data to preserve it in a different format
floorColorTexture.colorSpace = THREE.SRGBColorSpace

// This prevents the texture from being stretehced out resulting in very smooth looking surface
floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorColorTexture.repeat.set(8, 8)

// wrapS and wrapT prevents only the last pizel to be stretched out
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping

floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Wall
const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

// WrapT is no necessary since the repeat.set above does not go above 1
roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping


// Bush
const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

// Grave
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

// Door
const doorColorTexture = textureLoader.load('./door/color.webp')
const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('./door/height.webp')
const doorNormalTexture = textureLoader.load('./door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3, // to reduce how bumpy the texture is
        displacementBias: - 0.2
    })
)
floor.rotation.x = - Math.PI / 2
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

// House Container / Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture
    })
)
walls.position.y += 1.25 //1.25 is because 2.5 is 1.25 which is the part buried below the plane
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
)
roof.position.y += 3.25 //y value of the roof plus y value of the walls
roof.rotation.y = Math.PI / 4 //dividing by 4 for half of a quarter turn of a circle
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.y =+ 1
door.position.z =+ 2.01 //added .01 to prevent z-fighting with the front wall
house.add(door)


// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5) //you can use setScalar and send one value instead of set since x, y and z are the same size. see bush2
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = - 0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.setScalar(0.25) 
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = - 0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = - 0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.setScalar(0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = - 0.75

house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture
})

const graves = new THREE.Group()
scene.add(graves)

for(let i = 0; i < 30; i++){

    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4 //3 is from the radius of the house where you dont want grave. We want graves from 3 to 7 hence we multiply by 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius// x and z becaseu you dont want the grave to go up in the sky

    // Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.z = z
    grave.position.y = Math.random() * 0.4 //0.4 beacuse full height of the box is 0.8 so its half buried
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    // Add to graves to group
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d45', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and recieve
directionalLight.castShadow = true
ghost1.castShadow = true
ghost1.castShadow = true
ghost1.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

// since grave is in a group, we have to loop through it
for(const grave of graves.children){
    grave.castShadow = true
    grave.recieveShadow = true
}

// Mapping the camera for shadow
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.top = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.top = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.top = 10

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)


/**
 * Fog
 */
// scene.fog = new THREE.Fog('#ff0000', 10, 13)
scene.fog = new THREE.FogExp2('#02343f', 0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghost

    // To simulate random ghost movement on the y-axis, use a tool like https://www.desmos.com/ to run some calculations
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = - elapsedTime * 0.38 //to have it move in other direction, add minus 
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()