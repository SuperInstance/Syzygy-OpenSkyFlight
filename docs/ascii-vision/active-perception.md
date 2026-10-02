# Active Perception & Sensorimotor Learning — Knowledge Base

A science reference for building an AI agent that controls its own visual
resolution/frame-rate tradeoff: an agent that decides *how to look*, not
just *what to look at*.

Core thesis from four fields: perception is never passive reception. In
robotics it is sensor control for information gain; in infants it is the
sensorimotor loop that builds the body schema; in insects it is a
motion-first visual system cheaper than a single convolution; in humans
it is a foveal scanner driven by attention. All four point to the same
architecture: a cheap wide field for change-detection plus a steerable
high-resolution channel for detail, coupled to action through predictive
forward models.

---

## 1. Active perception in robotics / AI

### The founding definition

- **Bajcsy, R. (1988). "Active perception."** *Proceedings of the IEEE*,
  76(8), 966–1005. The seminal paper. An observer is "active" when
  engaged in activity whose purpose is to **control the geometric
  parameters of the sensory apparatus** in order to manipulate the
  constraints underlying the observed phenomena and improve perceptual
  results.
- **Aloimonos, J. et al. (1988). "Active vision."** *Int. Journal of
  Computer Vision*, 1(4), 333–356. Framed active vision as the general
  study of vision problems made well-posed by allowing the observer to
  move.
- **Bajcsy, Aloimonos & Tsotsos (2017). "Revisiting active perception."**
  *Autonomous Robots*. Updated definition: "An agent is an active
  perceiver if it knows **why** it wishes to sense, and then chooses
  **what** to perceive, and determines **how, when and where** to
  achieve that perception."

### The component taxonomy (from the 2017 revisit)

| Component | Meaning | Example |
|---|---|---|
| Sensor alignment (optical) | Control focal length, gain, shutter, white balance | Accommodation as an object nears |
| Sensor alignment (proprioceptive) | Control non-visual self-sensors (IMU) | Choosing the path the IMU travels |
| Scene selection (*what*) | Use only a region of interest of the data | ROI cropping for a detector |
| Temporal selection (*when*) | Predict when an event will occur / how long it lasts | Anticipating an object appearing in a frame sequence |
| Fixation (*where*) | Choose which part of the scene to view | Indirect object search via semantically related objects |
| Viewpoint selection | Move the sensor to a new pose | Next-best-view planning |

Every component is a **control decision over sensing**, not over the
world. The agent's action space includes its own sensor parameters.

### Decision-theoretic formulation

Active perception is naturally a **POMDP** (partially observable Markov
decision process): the agent selects sensing actions to reduce
uncertainty about hidden state variables under resource constraints
(Sondik 1971; Kaelbling et al. 1998). Two regimes:

- **Myopic**: greedily maximize immediate expected uncertainty reduction
  (sufficient when the environment is static).
- **Non-myopic**: plan sensing actions several steps ahead (needed when
  the state changes over time — e.g. a moving camera over moving
  terrain).

Satsangi et al. (2015) formalized **dynamic sensor selection**: at each
step, allocate K of N sensors to maximize information gain — directly
analogous to choosing a resolution/frame-rate operating point per frame.

### Recent work: learned active perception

- **"Eye, Robot: Learning to Look to Act with a BC-RL
  Perception-Action Loop"** (2025): an agent that learns to physically
  move its sensors ("look") in order to act, trained with a
  behavior-cloning + reinforcement-learning loop. Cites Bajcsy 1988 as
  the founding principle.
- **Cheung, Weiss & Olshausen (2017). "Emergence of foveal image
  sampling from learning to attend in visual scenes."** ICLR 2017.
  Key result: **foveal (non-uniform, center-dense) sampling emerges
  from learning to attend** — it is not hand-designed. An agent trained
  to allocate attention over scenes discovers the fovea/periphery split
  on its own.

**Takeaway for our agent:** sensing parameters (resolution, frame rate,
ROI) belong in the action space, optimized against task reward or
information gain — not fixed at design time.

---

## 2. Sensorimotor learning in developmental psychology

### Piaget's sensorimotor stage (birth–2 years)

Piaget's first stage of cognitive development: infants know the world
**only through movements and sensations**. Six substages:

1. Reflexive schemes (0–1 mo): inborn reflexes (grasping, sucking).
2. Primary circular reactions (1–4 mo): repeated actions centered on
   the infant's own body (thumb-sucking discovered by accident, then
   repeated).
3. Secondary circular reactions (4–8 mo): actions on the environment
   repeated for their effects (shaking a rattle to hear it).
4. Coordination of secondary schemes (8–12 mo): intentional,
   goal-directed action; the beginning of **object permanence**.
5. Tertiary circular reactions (12–18 mo): deliberate variation —
   experimentation ("what happens if I drop it *this* way?").
6. Mental representation (18–24 mo): internal models; deferred
   imitation.

The mechanism throughout: **schemas** (organized action patterns) are
built by assimilation (fitting experience to the schema) and
accommodation (changing the schema when it fails). Learning is the
residue of failed predictions.

### The body schema

The **body schema** is the brain's sensorimotor map of the body in
space — distinct from the conscious "body image." Evidence:

- **Rochat & Striano**: the first "object" newborns play with is their
  own body, especially self-touch. **Rochat & Hespos (1997)**: infants
  turn their heads toward tactile stimulation 3× more often when it is
  externally produced than self-produced — the nervous system tags
  self-generated sensation differently from the start.
- **Bremner et al. (2008)**: infants under ~10 months do not use vision
  to localize touch on the body; the schema is built from
  proprioception + touch before vision joins.
- Fetal **general movements** (from ~8 weeks gestation, Piontelli) act
  as bootstrap pattern generators: quasi-random spontaneous movement
  whose efference-copy + sensory-feedback pairs let the developing
  brain build cortical sensorimotor maps before any purposeful action
  exists.

### Efference copy and forward models — the computational core

- **von Holst & Mittelstaedt (1950)**: the *efference copy* (a copy of
  the motor command) is compared against *reafference* (incoming
  sensory feedback) to distinguish self-caused from externally-caused
  sensation. This is the mechanism behind the infant self-touch
  discrimination above.
- **Wolpert, Ghahramani & Jordan (1995)**; **Frith, Blakemore & Wolpert
  (2000)**; **Kawato et al. (2003)**: the **forward model** — a learned
  mapping from (efference copy of motor command) → (predicted sensory
  consequences). The prediction arrives with negligible delay and
  stands in for real feedback until it arrives; predicted sensations
  are **attenuated** (this is why you cannot tickle yourself).
  Forward models live in parietal lobe and cerebellum.
- **Agency experiments (Rovee-Collier mobile paradigm)**: an infant's
  limb is tethered to an overhead mobile; infants 2–3 months old
  selectively increase kicking when it moves the mobile, and suppress
  movement when the mobile moves incongruently. Dynamical-systems
  models reproduce this as a bifurcation driven by **detecting the
  contingency between efference copy and sensory change** — the
  operational definition of the sense of agency.

**Takeaway for our agent:** the agent needs a forward model mapping
(sensor-config action + motor action) → (predicted next percept). The
resolution/frame-rate choice is itself a motor action with predictable
sensory consequences (higher fps → better motion signal, worse spatial
detail). Agency — and therefore learning — begins when the agent can
detect that *it* caused a change in what it sees.

---

## 3. Insect vision: Drosophila and the motion-first eye

### Hardware: the compound eye

- *Drosophila melanogaster*: ~750–800 **ommatidia** (facets) in a
  hexagonal array on a hemisphere, maximizing field of view. Each
  ommatidium houses 8 photoreceptors (R1–R8); R1–R6 feed motion
  detection.
- The optic lobe preserves **retinotopy**: 800 columns mirroring the
  800 facets, so visual space is tiled one column per facet.
- Photoreceptor signals pass through the **lamina** (L1/L2/L3 cells),
  which acts as a **high-pass filter** — enhancing contrast and
  discarding redundant static information. The lamina splits into ON
  (brightness increase) and OFF (brightness decrease) channels.

### The elementary motion detector (EMD)

- **Hassenstein & Reichardt (1956)**: the correlation-type motion
  detector, derived from optomotor turning responses of insects.
  The model: take signals from **two neighboring spatial samples**,
  **delay one**, **multiply**, do the same in mirror symmetry, and
  **subtract**. The result is direction-selective.

  Formally, for adjacent samples A (upstream) and B (downstream)
  with delay τ:

  ```
  R = max(0, A(t−τ)·B(t) − A(t)·B(t−τ))
  ```

  Half-wave rectification separates preferred from null direction.
  Cost per detector: **two low-pass filters, two subtractions, one
  multiplication** (Scientific Reports, 2018).

- **Borst lab (Max Planck Institute of Neurobiology)**: calcium imaging
  confirmed the biological implementation. **T4 cells** are the ON
  (bright-edge) direction-selective stage; **T5 cells** are the OFF
  (dark-edge) stage — the first direction-selective cells in the
  pathway, just a few layers behind the photoreceptors. Each has **four
  subtypes** tuned to the four cardinal directions (front-to-back,
  back-to-front, up, down). Blocking T4 makes flies blind to
  dark-to-light motion; blocking T5 blinds them to light-to-dark
  motion. Without both, the fly is **motion-blind** and cannot correct
  its flight course.
- **Developmental note (Desplan lab, NYU)**: T4/T5 subtypes with
  opposite direction selectivity are born from the same stem cell in
  the same division and project to the same retinotopic position —
  complex directional circuitry from a simple developmental rule.

### Wide-field integration and flight control

- **Tangential cells** in the lobula plate pool thousands of EMD
  outputs across the visual field, computing global optic flow — the
  pattern of motion produced by the insect's own movement through the
  world.
- The **optomotor response**: wide-field motion in one direction
  triggers a syndirectional turn — the fly assumes the world rotated
  because *it* deviated, and corrects. This is a closed
  sensorimotor loop running on EMD outputs, used for course
  stabilization, landing, and object tracking.
- Optic-flow strategies are attractive for miniature flying vehicles
  precisely because of **low computational cost** (Scientific Reports,
  2018): EMD arrays have been demonstrated controlling simulated and
  real robotic agents.

### What "motion first" means computationally

1. **Static content is discarded early** (lamina high-pass). The system
   spends almost no compute on what isn't changing.
2. **Direction selectivity is local and parallel** — 800 columns × 8
   direction channels, each a few multiplies. No global optimization.
3. **Form is derived from motion**, not the reverse. The fly knows
   where things are *because* they move relative to it (motion
   parallax), not by segmenting a high-res image.
4. **ON/OFF asymmetry is adaptive**: T4 (ON) responds best to *slow*
   bright edges; T5 (OFF) to *fast* dark edges — the two channels are
   tuned to different speed regimes found in natural scenes.

**Takeaway for our agent:** implement motion as the primary, cheapest
channel: per-cell temporal differencing across frames at low spatial
resolution. Detail (high-res sampling) is a second channel, gated by
what the motion channel reports. This inverts the usual pipeline
(high-res first, motion as a derived feature).

---

## 4. Foveated rendering and human visual attention

### The hardware numbers

- The human eye covers ~160° horizontal × 135° vertical per eye, but
  the **fovea** — the high-acuity center — spans only ~5° (about 2°
  for the foveola, the sharpest part).
- Photoreceptors (cones, rods, ganglion cells) are **non-uniformly
  distributed**: dense at the center, sparse in the periphery. Acuity
  falls off steeply with eccentricity.
- In a 2016-VR-HMD pixel budget, only **~4% of pixels are foveated
  pixels** (Patney, SIGGRAPH 2016) — i.e., 96% of a uniform render is
  wasted on retinal regions that cannot resolve it.

### Saccades and attention

- **Fixations**: 100–800 ms; **saccades**: 10–40 ms at up to
  1000°/s. Natural vision is a sequence of fixations — "an active
  process, determined by sequential choices of fixation locations"
  (Communications Biology, 2021).
- **Attention precedes the saccade**: processing shifts to the saccade
  target before the eyes land (PNAS, 2020 — microsaccade study shows
  selective high-acuity enhancement at the microsaccade target, with
  impairment at the opposite foveal location, strongest just before
  onset).
- **Two drivers** (Cater et al., 160 subjects): bottom-up
  (stimulus-driven: motion, contrast, onset) and top-down
  (task-driven). With a task, viewers fail to notice **90–95% of
  peripheral quality degradation** — attention gates what the periphery
  is allowed to report.
- Selective attention is a bottleneck of roughly **~100 bit/s**
  (Communications Biology, 2021): the brain *must* discard almost
  everything.

### Foveated rendering (graphics)

- **Fixed foveated rendering**: assume the gaze point (e.g. screen
  center); render periphery at reduced shading rate.
- **Dynamic foveated rendering**: eye-track the actual gaze point and
  move the high-detail region with it.
- **Krajancich, Kellnhofer & Wetzstein (2023), "Towards
  Attention-aware Foveated Rendering"** (arXiv:2302.01368): the first
  model of eccentricity-dependent contrast sensitivity that includes
  **attention allocation**. When the user concentrates on a foveal
  task, peripheral sensitivity drops *below* what anatomy alone
  predicts — so significantly more aggressive foveation is possible
  without perceived quality loss. Attention, not just optics, sets the
  budget.
- Classic implementation: **log-polar / space-variant sensing** —
  resolution falls as ~1/eccentricity, mimicking the retinal ganglion
  distribution (Sun, Fisher et al. 2008).

### Learned foveation in AI

- **strangecradles/saccadic-attention**: a transformer attention
  mechanism with a **learned sequential fixation policy** — high-res
  attention at the fixation point, low-res peripheral awareness
  elsewhere, accumulating understanding across fixations. Explicitly
  framed as the solution to "massive input under strict compute
  constraints," i.e. the same problem long-context LLMs face.
- Cheung et al. 2017 (above): foveal sampling **emerges** from
  training an agent to allocate attention — no hand-designed fovea
  needed.

**Takeaway for our agent:** resolution is not a property of the image;
it is a property of the **fixation policy**. The agent should maintain
a low-res wide field (periphery: motion + change detection) and spend
its resolution budget where attention — bottom-up (something moved) or
top-down (the task needs detail there) — directs it.

---

## 5. Synthesis: design principles for a self-steering visual system

Distilled from the four fields, as engineering requirements for an
agent that controls its own resolution/frame-rate tradeoff:

1. **Sensing actions are first-class actions** (Bajcsy/Aloimonos).
   Resolution, frame rate, and ROI go in the action space alongside
   motor commands, optimized against information gain or task reward
   (myopic when the world is static, non-myopic/POMDP when it moves).

2. **Every sensing action needs a forward model** (Wolpert/Frith).
   The agent must predict the sensory consequences of changing its own
   visual parameters (e.g. "dropping to 20 cols at 30 fps will smear
   spatial detail but sharpen the motion field"). Prediction error on
   this model is the learning signal — the same efference-copy
   mechanism by which infants discover agency.

3. **Motion is the cheap primary channel; detail is gated**
   (Drosophila). Run a low-spatial-resolution, high-temporal-rate
   differencing channel always (the EMD equivalent: delay, multiply,
   subtract — a handful of ops per cell). Spend high-resolution
   samples only where the motion channel or the task flags interest.
   Static content is discarded at the front end, not processed and
   then ignored.

4. **Resolution follows attention, and attention is two-stream**
   (human vision). Bottom-up: fast transients capture the high-res
   channel automatically. Top-down: the current task (landing? cruising?
   inspecting?) sets the baseline operating point. Per Krajancich et
   al., committed foveal attention *lowers* the required peripheral
   fidelity — the more certain the agent is about where to look, the
   cheaper the rest of the frame becomes.

5. **Foveation can be learned, not designed** (Cheung et al. 2017).
   Rather than hand-tuning the resolution schedule, train the fixation/
   resolution policy with RL against task performance and let the
   fovea/periphery split emerge. The ASCII grid makes this tractable:
   the entire visual system reconfigures in a single parameter
   (`cols`), so the policy's action space is tiny.

6. **Bootstrap from random sensorimotor babbling** (fetal general
   movements; Piaget's circular reactions). Before purposeful control,
   sweep resolution/frame-rate randomly while acting, and log
   (sensing-action, motor-action, percept-change) triples. This is the
   dataset from which the forward model — and then the policy — is
   learned. Babbling is not wasted compute; it is the training data
   for agency.

### The operating loop

```
perceive (low-res wide field + motion channel)
   → attend (bottom-up transients + top-down task state)
   → configure (set cols/fps/ROI = sensing action)
   → predict (forward model: expected next percept)
   → act (motor command)
   → compare (prediction error → update forward model + policy)
```

This is the sensorimotor loop of the infant, the optomotor loop of
the fly, and the active-perception loop of Bajcsy — implemented as one
system where "how to look" and "how to move" are learned together.

---

## Key references

- Bajcsy, R. (1988). Active perception. *Proc. IEEE*, 76(8), 966–1005.
- Aloimonos, J. et al. (1988). Active vision. *IJCV*, 1(4), 333–356.
- Bajcsy, R., Aloimonos, Y. & Tsotsos, J.K. (2017). Revisiting active
  perception. *Autonomous Robots*.
- Hassenstein, B. & Reichardt, W. (1956). Systemtheoretische Analyse
  der Zeit-, Reihenfolgen- und Vorzeichenauswertung bei der
  Bewegungsperzeption des Rüsselkäfers *Chlorophanus*. *Z. Naturforsch.*
- Borst, A. et al. (2013). Motional layers in the fly brain (T4/T5 as
  elementary motion detectors). *Science Daily* summary of MPI work;
  Serbe et al. (2016), *Neuron* (OFF pathway characterization).
- Wolpert, D.M., Ghahramani, Z. & Jordan, M.I. (1995). An internal
  model for sensorimotor integration. *Science*.
- Frith, C.D., Blakemore, S.-J. & Wolpert, D.M. (2000). Abnormalities
  in the awareness and control of action. *Phil. Trans. R. Soc. B*.
- Piaget, J. (1952). *The Origins of Intelligence in Children*.
- Rochat, P. & Hespos, S.J. (1997). Differential rooting response by
  neonates. *Early Development and Parenting*.
- Krajancich, B., Kellnhofer, P. & Wetzstein, G. (2023). Towards
  attention-aware foveated rendering. arXiv:2302.01368.
- Cheung, B., Weiss, E. & Olshausen, B.A. (2017). Emergence of foveal
  image sampling from learning to attend in visual scenes. ICLR 2017.
- "Eye, Robot: Learning to Look to Act with a BC-RL Perception-Action
  Loop" (2025). https://www.alphaxiv.org/overview/2506.10968v1
- Nature (2018). Spatial encoding of translational optic flow by EMD
  arrays. *Scientific Reports*. https://www.nature.com/articles/s41598-018-24162-z
