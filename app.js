"use strict";

const START_DATE = new Date(2026, 6, 7);
const HOLIDAY_DATE = new Date(2026, 7, 17);
const STORAGE_KEY = "holiday-fit-tracker-v1";
const START_WEIGHT_KG = 63.8;
const PROTEIN_TARGET = 102;
const WATER_TARGET = 2500;
const DAY_MS = 24 * 60 * 60 * 1000;
const RING_LENGTH = 326.73;

const progression = [
  {
    week: 1,
    title: "Base week",
    work: 40,
    rest: 20,
    mainRounds: 3,
    accessoryRounds: 3,
    finisherRounds: 3,
    note: "Learn the moves, use slow lowering, finish with clean form."
  },
  {
    week: 2,
    title: "Density week",
    work: 45,
    rest: 15,
    mainRounds: 3,
    accessoryRounds: 3,
    finisherRounds: 3,
    note: "Same length, more work, less rest."
  },
  {
    week: 3,
    title: "Control week",
    work: 45,
    rest: 15,
    mainRounds: 3,
    accessoryRounds: 3,
    finisherRounds: 4,
    note: "Add pauses on legs and abs. Arms get a harder squeeze."
  },
  {
    week: 4,
    title: "Pressure week",
    work: 50,
    rest: 10,
    mainRounds: 3,
    accessoryRounds: 3,
    finisherRounds: 4,
    note: "Short rests. Keep breathing under control."
  },
  {
    week: 5,
    title: "Peak build",
    work: 50,
    rest: 10,
    mainRounds: 4,
    accessoryRounds: 3,
    finisherRounds: 4,
    note: "One extra main round. Eat and sleep like it matters."
  },
  {
    week: 6,
    title: "Holiday week",
    work: 55,
    rest: 5,
    mainRounds: 3,
    accessoryRounds: 3,
    finisherRounds: 4,
    note: "Fast transitions, sharp form, no reckless reps."
  }
];

const ongoingProgression = [
  {
    week: 1,
    title: "Rebuild",
    work: 40,
    rest: 20,
    mainRounds: 3,
    accessoryRounds: 3,
    finisherRounds: 3,
    note: "Reset the cycle and polish technique."
  },
  {
    week: 2,
    title: "Build",
    work: 45,
    rest: 15,
    mainRounds: 3,
    accessoryRounds: 3,
    finisherRounds: 4,
    note: "Push density while staying smooth."
  },
  {
    week: 3,
    title: "Hard week",
    work: 50,
    rest: 10,
    mainRounds: 4,
    accessoryRounds: 3,
    finisherRounds: 4,
    note: "Hardest week of the loop."
  },
  {
    week: 4,
    title: "Deload",
    work: 35,
    rest: 25,
    mainRounds: 3,
    accessoryRounds: 2,
    finisherRounds: 2,
    note: "Move well, recover, then repeat."
  }
];

const exerciseInfo = {
  "March + Arm Swings": {
    muscle: "Warm-up",
    how: "March on the spot while swinging your arms forward and back. Gradually make the knees higher and the arms bigger.",
    cues: ["Stay tall", "Land softly", "Breathe through the nose if you can"],
    adjust: "Step slower if your heart rate jumps too fast."
  },
  "World's Greatest Stretch": {
    muscle: "Hips, spine, shoulders",
    how: "Step into a long lunge, place both hands inside the front foot, rotate the chest open, then switch sides.",
    cues: ["Back leg long", "Front foot flat", "Rotate from the upper back"],
    adjust: "Keep the back knee down if the full lunge is too much."
  },
  "Squat to Reach": {
    muscle: "Legs and hips",
    how: "Sit into a squat, pause, then stand and reach both arms overhead.",
    cues: ["Chest proud", "Knees follow toes", "Exhale as you stand"],
    adjust: "Use a smaller squat if ankles or hips feel tight."
  },
  "Inchworm Walkout": {
    muscle: "Core, shoulders, hamstrings",
    how: "Fold forward, walk hands to a plank, hold briefly, then walk hands back and stand.",
    cues: ["Brace before the plank", "Keep hips steady", "Use small hand steps"],
    adjust: "Bend the knees as much as needed."
  },
  "Glute Bridge": {
    muscle: "Glutes and hamstrings",
    how: "Lie on your back with knees bent. Drive through heels, squeeze glutes, lift hips, then lower with control.",
    cues: ["Ribs down", "Squeeze at the top", "Do not arch the lower back"],
    adjust: "Hold the top for two seconds to make it harder."
  },
  "Fast Feet": {
    muscle: "Conditioning",
    how: "Stay low and run your feet quickly in place with short, light steps.",
    cues: ["Soft feet", "Arms active", "Chest up"],
    adjust: "March quickly instead of running if you need low impact."
  },
  "Tempo Squat": {
    muscle: "Quads, glutes, core",
    how: "Stand with feet about shoulder width. Lower for three seconds, pause at the bottom, then stand strong.",
    cues: ["Knees track over toes", "Keep the whole foot down", "Brace before lowering"],
    adjust: "Hold the dumbbell at your chest or use bodyweight only."
  },
  "Push-up": {
    muscle: "Chest, shoulders, triceps, core",
    how: "Start in a plank. Lower chest toward the floor with elbows about 45 degrees, then press back up.",
    cues: ["Body in one line", "Hands under shoulders", "Exhale as you press"],
    adjust: "Use knees or hands on a sofa. Make it harder with slower lowering."
  },
  "One-arm Dumbbell Row": {
    muscle: "Back and biceps",
    how: "Hinge at the hips with one hand on a chair or thigh. Pull the dumbbell toward your hip, then lower slowly.",
    cues: ["Shoulder down", "Elbow toward back pocket", "Do not twist"],
    adjust: "Add a one-second squeeze at the top."
  },
  "Reverse Lunge": {
    muscle: "Quads, glutes, balance",
    how: "Step one foot back, lower both knees, then push through the front foot to stand.",
    cues: ["Front knee steady", "Tall chest", "Control the back knee"],
    adjust: "Hold the dumbbell on the working side or use bodyweight."
  },
  "Forearm Plank": {
    muscle: "Abs and shoulders",
    how: "Hold a straight line from head to heels on forearms and toes. Brace as if someone will tap your stomach.",
    cues: ["Ribs down", "Squeeze glutes", "Push the floor away"],
    adjust: "Use knees down or shorten the hold."
  },
  "Single-leg Romanian Deadlift": {
    muscle: "Hamstrings, glutes, balance",
    how: "Stand on one leg, hinge at the hips, reach the free leg back, then drive the hip forward to stand.",
    cues: ["Hips square", "Back long", "Move slowly"],
    adjust: "Hold a wall for balance or hold the dumbbell in the opposite hand."
  },
  "Dumbbell Floor Press": {
    muscle: "Chest and triceps",
    how: "Lie on your back, press the dumbbell from chest height to straight arm, then lower until the upper arm touches the floor.",
    cues: ["Wrist stacked", "Ribs down", "Slow lower"],
    adjust: "Do one arm at a time and switch halfway through the work interval."
  },
  "Glute Bridge March": {
    muscle: "Glutes, hamstrings, core",
    how: "Hold a glute bridge and lift one knee at a time without letting the hips drop or twist.",
    cues: ["Hips level", "Small steps", "Glutes tight"],
    adjust: "Do normal bridges if your hips wobble."
  },
  "Pike Push-up": {
    muscle: "Shoulders and triceps",
    how: "Start in a high-hip plank. Bend elbows and lower the head toward the floor, then press back up.",
    cues: ["Hips high", "Elbows controlled", "Look back at your feet"],
    adjust: "Use a smaller range or swap for incline push-ups."
  },
  "Bicycle Crunch": {
    muscle: "Abs and obliques",
    how: "Lie on your back, rotate opposite elbow toward opposite knee, and switch with control.",
    cues: ["Slow rotation", "Lower back controlled", "Exhale each twist"],
    adjust: "Keep feet higher if your lower back lifts."
  },
  "Dumbbell Biceps Curl": {
    muscle: "Biceps",
    how: "Stand tall, curl the dumbbell without swinging, squeeze the biceps, then lower slowly.",
    cues: ["Elbow pinned", "No body swing", "Full lower"],
    adjust: "Switch arms halfway or do both hands on the dumbbell."
  },
  "Overhead Triceps Extension": {
    muscle: "Triceps",
    how: "Hold the dumbbell overhead with both hands. Bend elbows to lower it behind your head, then extend.",
    cues: ["Elbows narrow", "Ribs down", "Squeeze at the top"],
    adjust: "Do it seated if your back arches."
  },
  "Dead Bug": {
    muscle: "Deep core",
    how: "Lie on your back with knees up. Lower opposite arm and leg, exhale, then return and switch.",
    cues: ["Lower back heavy", "Slow limbs", "Exhale fully"],
    adjust: "Tap heels instead of straightening legs."
  },
  "Hollow Hold": {
    muscle: "Abs",
    how: "Lie on your back, lift shoulders and legs, and hold a curved hollow shape without arching your lower back.",
    cues: ["Ribs down", "Reach long", "Shake is fine, pain is not"],
    adjust: "Bend knees or keep one foot down."
  },
  "Burpee Step-back": {
    muscle: "Full body conditioning",
    how: "Squat down, step or jump back to plank, return feet forward, then stand or jump.",
    cues: ["Hands planted", "Brace in plank", "Land softly"],
    adjust: "Step back instead of jumping, and skip the push-up."
  },
  "Mountain Climber": {
    muscle: "Core and conditioning",
    how: "From a high plank, drive knees toward the chest one at a time at a strong pace.",
    cues: ["Shoulders over hands", "Hips steady", "Quick feet"],
    adjust: "Slow the knees down and focus on bracing."
  },
  "Split Squat": {
    muscle: "Quads and glutes",
    how: "Stand in a staggered stance. Lower straight down, then push through the front foot to stand.",
    cues: ["Front foot flat", "Back knee under hip", "Tall torso"],
    adjust: "Hold a wall for balance or add the dumbbell at your chest."
  },
  "Lateral Lunge": {
    muscle: "Glutes, inner thighs, quads",
    how: "Step to the side, sit hips back into the working leg, then push back to center.",
    cues: ["Working foot flat", "Other leg long", "Chest lifted"],
    adjust: "Use a smaller side step."
  },
  "Single-leg Glute Bridge": {
    muscle: "Glutes and hamstrings",
    how: "Bridge with one foot planted and the other leg lifted. Lift hips, squeeze, then lower.",
    cues: ["Hips level", "Heel drives down", "Slow lower"],
    adjust: "Use two-leg bridges when form slips."
  },
  "Calf Raise": {
    muscle: "Calves",
    how: "Stand tall, rise onto the balls of your feet, pause, then lower under control.",
    cues: ["Full height", "Slow lower", "Ankles straight"],
    adjust: "Use one leg at a time to make it harder."
  },
  "Wall Sit": {
    muscle: "Quads",
    how: "Slide your back down a wall until thighs are close to parallel and hold.",
    cues: ["Knees over ankles", "Back flat", "Breathe steadily"],
    adjust: "Sit higher if knees complain."
  },
  "Jump Squat": {
    muscle: "Leg power and conditioning",
    how: "Squat, jump up, land softly, and immediately reset into the next rep.",
    cues: ["Soft landing", "Knees track toes", "Use arms"],
    adjust: "Do fast bodyweight squats for low impact."
  },
  "Skater": {
    muscle: "Glutes and conditioning",
    how: "Leap or step side to side, landing on one leg and reaching the other leg behind.",
    cues: ["Land softly", "Hips back", "Control before switching"],
    adjust: "Step instead of jumping."
  },
  "Goblet Squat Pulse": {
    muscle: "Quads and glutes",
    how: "Hold the dumbbell at your chest, squat down, pulse in the lower half, then stand when needed.",
    cues: ["Stay low", "Chest up", "Do not bounce loose"],
    adjust: "Use bodyweight if the lower back works too hard."
  },
  "Reverse Crunch": {
    muscle: "Lower abs",
    how: "Lie on your back, lift knees toward chest, curl hips slightly off the floor, then lower slowly.",
    cues: ["Small curl", "No swinging", "Exhale up"],
    adjust: "Hold the floor beside you for support."
  },
  "Plank Jack": {
    muscle: "Core and conditioning",
    how: "Hold a high plank and jump or step feet out and in like a jumping jack.",
    cues: ["Hips steady", "Hands under shoulders", "Light feet"],
    adjust: "Step one foot at a time."
  },
  "Squat Hold": {
    muscle: "Legs and hips",
    how: "Hold the bottom of a squat with chest up and feet rooted.",
    cues: ["Knees out", "Breathe", "Stay active"],
    adjust: "Hold a door frame or sit higher."
  },
  "Side Plank": {
    muscle: "Obliques and shoulders",
    how: "Stack elbow under shoulder and hold a straight side line from head to feet.",
    cues: ["Hips high", "Neck long", "Ribs tucked"],
    adjust: "Use the bottom knee on the floor."
  },
  "Heel Tap": {
    muscle: "Abs",
    how: "Lie on your back with knees bent. Lift shoulders and reach side to side to tap heels.",
    cues: ["Small crunch", "Ribs down", "Reach from the ribs"],
    adjust: "Move feet closer to make it easier."
  },
  "Squat Thrust": {
    muscle: "Full body conditioning",
    how: "From standing, hands to floor, jump or step feet back to plank, then return feet and stand.",
    cues: ["Brace plank", "Feet under hips", "Smooth rhythm"],
    adjust: "Step one foot at a time."
  },
  "Hammer Curl": {
    muscle: "Biceps and forearms",
    how: "Hold the dumbbell with a neutral grip and curl without turning the wrist.",
    cues: ["Elbow still", "Wrist straight", "Slow lower"],
    adjust: "Switch arms halfway through the interval."
  },
  "Lateral Raise": {
    muscle: "Shoulders",
    how: "Raise the dumbbell out to the side to shoulder height with a soft elbow, then lower slowly.",
    cues: ["Shoulder down", "Lead with elbow", "No shrugging"],
    adjust: "Use a shorter range or both hands on the dumbbell."
  },
  "Close-grip Push-up": {
    muscle: "Triceps, chest, core",
    how: "Set hands just inside shoulder width and lower with elbows close to your ribs.",
    cues: ["Elbows back", "Body straight", "Press the floor away"],
    adjust: "Use knees or a raised surface."
  },
  "Superman Pull": {
    muscle: "Upper back and glutes",
    how: "Lie face down, lift chest and legs gently, then pull elbows toward ribs and reach again.",
    cues: ["Long neck", "Glutes on", "Small controlled lift"],
    adjust: "Keep legs down if the lower back feels crowded."
  },
  "Russian Twist": {
    muscle: "Obliques",
    how: "Sit back slightly, rotate your torso side to side, and move the dumbbell or hands with control.",
    cues: ["Rotate ribs", "Chest lifted", "Do not yank"],
    adjust: "Keep heels down or use no weight."
  },
  "Bear Crawl Hold": {
    muscle: "Core and shoulders",
    how: "Set hands under shoulders, knees under hips, lift knees slightly, and hold.",
    cues: ["Back flat", "Knees low", "Push floor away"],
    adjust: "Hold for shorter bursts."
  },
  "Shadow Boxing": {
    muscle: "Conditioning, shoulders, core",
    how: "Punch straight, cross, hook, and uppercut combinations while staying light on your feet.",
    cues: ["Hands return to guard", "Rotate hips", "Stay loose"],
    adjust: "Remove bouncing and keep the punches crisp."
  },
  "Goblet Squat": {
    muscle: "Quads, glutes, core",
    how: "Hold the dumbbell at your chest, sit into a squat, pause, then stand.",
    cues: ["Elbows down", "Feet rooted", "Chest tall"],
    adjust: "Use a three-second lower to make 9 lb feel heavier."
  },
  "Plank Dumbbell Drag": {
    muscle: "Core, shoulders, lats",
    how: "From high plank, drag the dumbbell across your body with the opposite hand, alternating sides.",
    cues: ["Hips still", "Wide feet", "Slow drag"],
    adjust: "Use knees down or tap the dumbbell instead of dragging."
  },
  "Bulgarian Split Squat": {
    muscle: "Quads and glutes",
    how: "Place back foot on a chair or sofa. Lower the front leg into a split squat, then drive up.",
    cues: ["Front foot far enough forward", "Torso tall", "Slow bottom"],
    adjust: "Do regular split squats if balance is limiting."
  },
  "Incline Push-up": {
    muscle: "Chest, shoulders, triceps",
    how: "Place hands on a sturdy raised surface and perform a push-up with a straight body.",
    cues: ["Body straight", "Chest to surface", "Elbows controlled"],
    adjust: "Lower the surface to make it harder."
  },
  "V-up": {
    muscle: "Abs and hip flexors",
    how: "Lie long, lift arms and legs toward each other, then lower with control.",
    cues: ["Exhale up", "Reach long", "Control down"],
    adjust: "Do tuck-ups with bent knees."
  },
  "Curl to Press": {
    muscle: "Biceps and shoulders",
    how: "Curl the dumbbell to shoulder height, press overhead, lower to shoulder, then lower the curl.",
    cues: ["No lean back", "Wrist stacked", "Control both directions"],
    adjust: "Switch arms halfway."
  },
  "Triceps Dip": {
    muscle: "Triceps",
    how: "Use a sturdy chair. Hands beside hips, lower by bending elbows, then press up.",
    cues: ["Elbows back", "Shoulders down", "Stay close to chair"],
    adjust: "Bend knees more or swap for overhead extensions."
  },
  "Cossack Squat": {
    muscle: "Adductors, glutes, quads",
    how: "Take a wide stance, shift into one side while the other leg stays long, then switch.",
    cues: ["Heel down", "Hips back", "Move slowly"],
    adjust: "Hold a door frame or use a shallow range."
  },
  "Hip Thrust": {
    muscle: "Glutes",
    how: "Upper back on a sofa or floor, knees bent. Drive hips up, squeeze, then lower.",
    cues: ["Chin tucked", "Ribs down", "Full glute squeeze"],
    adjust: "Place the dumbbell on hips if comfortable."
  },
  "Walking Lunge": {
    muscle: "Quads and glutes",
    how: "Step forward into a lunge, push through the front foot, and continue alternating.",
    cues: ["Long enough step", "Front knee steady", "Tall chest"],
    adjust: "Do reverse lunges if space is tight."
  },
  "Squat Pulse": {
    muscle: "Quads and glutes",
    how: "Hold a low squat and pulse a few inches up and down with constant tension.",
    cues: ["Stay braced", "Knees out", "Do not bounce loose"],
    adjust: "Stand briefly when form fades."
  },
  "Plank to Pike": {
    muscle: "Core and shoulders",
    how: "Start in high plank, lift hips into a pike, then return to plank.",
    cues: ["Push floor away", "Control hips", "Brace on return"],
    adjust: "Step feet in rather than sliding or jumping."
  },
  "Flutter Kick": {
    muscle: "Abs and hip flexors",
    how: "Lie on your back and alternate small leg kicks while keeping the lower back controlled.",
    cues: ["Ribs down", "Small kicks", "Breathe"],
    adjust: "Lift legs higher or place hands under hips."
  },
  "Side Plank Hip Dip": {
    muscle: "Obliques",
    how: "From side plank, lower hips a few inches, then lift back to a straight line.",
    cues: ["Elbow under shoulder", "Move slowly", "Top hip stacked"],
    adjust: "Use the bottom knee down."
  },
  "Toe Touch": {
    muscle: "Upper abs",
    how: "Lie on your back with legs up. Reach hands toward toes, lift shoulders, then lower.",
    cues: ["Reach up, not forward", "Exhale", "Slow lower"],
    adjust: "Bend knees slightly."
  },
  "Hollow Rock": {
    muscle: "Abs",
    how: "Hold a hollow body shape and gently rock while keeping ribs down.",
    cues: ["Small rocks", "Lower back controlled", "Stay long"],
    adjust: "Hold still or bend knees."
  },
  "Jumping Lunge": {
    muscle: "Legs and conditioning",
    how: "Start in a lunge, jump and switch legs in the air, landing softly in the next lunge.",
    cues: ["Soft knees", "Tall chest", "Control landing"],
    adjust: "Do alternating reverse lunges."
  },
  "High Knees": {
    muscle: "Conditioning",
    how: "Run in place with knees driving up and arms pumping.",
    cues: ["Tall posture", "Quick feet", "Land softly"],
    adjust: "March fast for low impact."
  },
  "Shoulder Tap": {
    muscle: "Core and shoulders",
    how: "From high plank, tap opposite shoulder without letting hips sway.",
    cues: ["Wide feet", "Slow taps", "Hips square"],
    adjust: "Use knees down."
  },
  "Child's Pose Breathing": {
    muscle: "Cooldown",
    how: "Sit hips back, reach arms forward, and take slow breaths into your back and ribs.",
    cues: ["Long exhales", "Relax jaw", "Let shoulders drop"],
    adjust: "Place a pillow under hips if needed."
  },
  "Hip Flexor Stretch": {
    muscle: "Cooldown",
    how: "Half kneel, tuck pelvis slightly, and shift forward until the front of the back hip stretches.",
    cues: ["Glute squeezed", "Ribs down", "Gentle pressure"],
    adjust: "Pad the knee or stand if kneeling bothers you."
  },
  "Hamstring Fold": {
    muscle: "Cooldown",
    how: "Hinge forward with soft knees and let the back of the legs relax.",
    cues: ["Soft knees", "Long breaths", "No forcing"],
    adjust: "Place hands on thighs instead of reaching the floor."
  },
  "Chest Opener": {
    muscle: "Cooldown",
    how: "Clasp hands behind your back or hold a doorway and gently open the chest.",
    cues: ["Shoulders down", "Neck relaxed", "Breathe slowly"],
    adjust: "Use a towel between hands if needed."
  }
};

const workouts = [
  {
    title: "Full Body Strength A",
    split: "Squat, push, row, core",
    detail: "Controlled reps, short rests, full body pressure.",
    blocks: [
      { name: "Warm-up", kind: "warmup", rounds: 1, exercises: ["March + Arm Swings", "World's Greatest Stretch", "Squat to Reach", "Inchworm Walkout", "Glute Bridge", "Fast Feet", "Squat to Reach", "March + Arm Swings"] },
      { name: "Block A", kind: "main", roundsKey: "mainRounds", exercises: ["Tempo Squat", "Push-up", "One-arm Dumbbell Row", "Reverse Lunge", "Forearm Plank"] },
      { name: "Block B", kind: "main", roundsKey: "mainRounds", exercises: ["Single-leg Romanian Deadlift", "Dumbbell Floor Press", "Glute Bridge March", "Pike Push-up", "Bicycle Crunch"] },
      { name: "Arms + Abs", kind: "main", roundsKey: "accessoryRounds", exercises: ["Dumbbell Biceps Curl", "Overhead Triceps Extension", "Dead Bug", "Hollow Hold"] },
      { name: "Finisher", kind: "finisher", roundsKey: "finisherRounds", exercises: ["Burpee Step-back", "Mountain Climber"] }
    ]
  },
  {
    title: "Legs + Core HIIT",
    split: "Legs, glutes, abs",
    detail: "Leg burn with core work between hard conditioning bursts.",
    blocks: [
      { name: "Warm-up", kind: "warmup", rounds: 1, exercises: ["March + Arm Swings", "Squat to Reach", "World's Greatest Stretch", "Glute Bridge", "Fast Feet", "Lateral Lunge", "Squat to Reach", "March + Arm Swings"] },
      { name: "Leg Strength", kind: "main", roundsKey: "mainRounds", exercises: ["Split Squat", "Lateral Lunge", "Single-leg Glute Bridge", "Calf Raise", "Wall Sit"] },
      { name: "Core Heat", kind: "main", roundsKey: "mainRounds", exercises: ["Jump Squat", "Skater", "Goblet Squat Pulse", "Reverse Crunch", "Plank Jack"] },
      { name: "Abs Lock", kind: "main", roundsKey: "accessoryRounds", exercises: ["Squat Hold", "Side Plank", "Heel Tap", "Dead Bug"] },
      { name: "Finisher", kind: "finisher", roundsKey: "finisherRounds", exercises: ["High Knees", "Squat Thrust"] }
    ]
  },
  {
    title: "Upper Pump + Conditioning",
    split: "Arms, chest, back, shoulders",
    detail: "Upper body volume with a sweat-heavy finish.",
    blocks: [
      { name: "Warm-up", kind: "warmup", rounds: 1, exercises: ["March + Arm Swings", "Inchworm Walkout", "World's Greatest Stretch", "Fast Feet", "Push-up", "Chest Opener", "March + Arm Swings", "Squat to Reach"] },
      { name: "Upper Strength", kind: "main", roundsKey: "mainRounds", exercises: ["Push-up", "One-arm Dumbbell Row", "Pike Push-up", "Dumbbell Floor Press", "Shoulder Tap"] },
      { name: "Arm Pump", kind: "main", roundsKey: "mainRounds", exercises: ["Dumbbell Biceps Curl", "Hammer Curl", "Overhead Triceps Extension", "Lateral Raise", "Close-grip Push-up"] },
      { name: "Core + Back", kind: "main", roundsKey: "accessoryRounds", exercises: ["Superman Pull", "Russian Twist", "Bear Crawl Hold", "Hollow Hold"] },
      { name: "Finisher", kind: "finisher", roundsKey: "finisherRounds", exercises: ["Shadow Boxing", "Mountain Climber"] }
    ]
  },
  {
    title: "Full Body Strength B",
    split: "Hinge, press, legs, abs",
    detail: "Single-leg work and presses to make light weight feel serious.",
    blocks: [
      { name: "Warm-up", kind: "warmup", rounds: 1, exercises: ["March + Arm Swings", "World's Greatest Stretch", "Glute Bridge", "Inchworm Walkout", "Fast Feet", "Squat to Reach", "Hip Flexor Stretch", "March + Arm Swings"] },
      { name: "Block A", kind: "main", roundsKey: "mainRounds", exercises: ["Goblet Squat", "Single-leg Romanian Deadlift", "Dumbbell Floor Press", "Plank Dumbbell Drag", "Side Plank"] },
      { name: "Block B", kind: "main", roundsKey: "mainRounds", exercises: ["Bulgarian Split Squat", "Incline Push-up", "One-arm Dumbbell Row", "Hip Thrust", "V-up"] },
      { name: "Arms + Core", kind: "main", roundsKey: "accessoryRounds", exercises: ["Curl to Press", "Triceps Dip", "Reverse Crunch", "Forearm Plank"] },
      { name: "Finisher", kind: "finisher", roundsKey: "finisherRounds", exercises: ["Burpee Step-back", "Skater"] }
    ]
  },
  {
    title: "Glutes, Legs + Abs",
    split: "Leg size, glutes, waist control",
    detail: "Hard leg volume with core work that rewards patience.",
    blocks: [
      { name: "Warm-up", kind: "warmup", rounds: 1, exercises: ["March + Arm Swings", "Squat to Reach", "Glute Bridge", "Lateral Lunge", "Fast Feet", "World's Greatest Stretch", "Calf Raise", "March + Arm Swings"] },
      { name: "Leg Builder", kind: "main", roundsKey: "mainRounds", exercises: ["Bulgarian Split Squat", "Cossack Squat", "Hip Thrust", "Calf Raise", "Wall Sit"] },
      { name: "Leg Density", kind: "main", roundsKey: "mainRounds", exercises: ["Walking Lunge", "Squat Pulse", "Single-leg Romanian Deadlift", "Plank to Pike", "Flutter Kick"] },
      { name: "Abs Finish", kind: "main", roundsKey: "accessoryRounds", exercises: ["Side Plank Hip Dip", "Toe Touch", "Dead Bug", "Hollow Rock"] },
      { name: "Finisher", kind: "finisher", roundsKey: "finisherRounds", exercises: ["Jumping Lunge", "High Knees"] }
    ]
  },
  {
    title: "Conditioning + Arms",
    split: "Sweat, arms, abs",
    detail: "Optional sixth day. Keep it crisp and athletic.",
    blocks: [
      { name: "Warm-up", kind: "warmup", rounds: 1, exercises: ["March + Arm Swings", "Inchworm Walkout", "Squat to Reach", "Fast Feet", "World's Greatest Stretch", "Push-up", "Glute Bridge", "March + Arm Swings"] },
      { name: "Conditioning", kind: "main", roundsKey: "mainRounds", exercises: ["Squat Thrust", "Push-up", "Mountain Climber", "Skater", "Plank Jack"] },
      { name: "Arm Builder", kind: "main", roundsKey: "mainRounds", exercises: ["Dumbbell Biceps Curl", "Overhead Triceps Extension", "Shoulder Tap", "Lateral Raise", "Close-grip Push-up"] },
      { name: "Core Hold", kind: "main", roundsKey: "accessoryRounds", exercises: ["Bear Crawl Hold", "Bicycle Crunch", "Squat Hold", "Hollow Hold"] },
      { name: "Finisher", kind: "finisher", roundsKey: "finisherRounds", exercises: ["Burpee Step-back", "High Knees"] }
    ]
  },
  {
    title: "Recovery + Core Reset",
    split: "Mobility, easy core, walk",
    detail: "Keep the streak alive without burying recovery.",
    recovery: true,
    blocks: [
      { name: "Move Easy", kind: "warmup", rounds: 1, exercises: ["March + Arm Swings", "World's Greatest Stretch", "Hip Flexor Stretch", "Hamstring Fold", "Chest Opener", "Glute Bridge", "Dead Bug", "Child's Pose Breathing"] },
      { name: "Core Reset", kind: "main", roundsKey: "accessoryRounds", exercises: ["Dead Bug", "Side Plank", "Glute Bridge", "Forearm Plank"] },
      { name: "Cooldown", kind: "cooldown", rounds: 1, exercises: ["Child's Pose Breathing", "Hip Flexor Stretch", "Hamstring Fold", "Chest Opener"] }
    ]
  }
];

const quickMeals = {
  eggs: { type: "Breakfast", name: "Eggs + toast", protein: 24, calories: 430 },
  yoghurt: { type: "Snack", name: "Greek yoghurt + fruit", protein: 22, calories: 260 },
  chicken: { type: "Lunch", name: "Chicken rice bowl", protein: 42, calories: 620 },
  tuna: { type: "Lunch", name: "Tuna potato", protein: 35, calories: 520 },
  lentils: { type: "Dinner", name: "Lentil curry", protein: 26, calories: 560 }
};

let state = loadState();
let activeView = "today";
let timer = {
  sequence: [],
  index: 0,
  remaining: 0,
  running: false,
  total: 0,
  segmentLength: 0,
  intervalId: null
};

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  render();
  registerServiceWorker();
});

function loadState() {
  const fallback = {
    planStart: dateKey(START_DATE),
    completions: {},
    water: {},
    food: {},
    measurements: [
      {
        id: "start",
        date: dateKey(START_DATE),
        weight: START_WEIGHT_KG,
        waist: "",
        note: "Starting check-in"
      }
    ]
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return fallback;
    return {
      ...fallback,
      ...saved,
      completions: saved.completions || {},
      water: saved.water || {},
      food: saved.food || {},
      measurements: Array.isArray(saved.measurements) && saved.measurements.length ? saved.measurements : fallback.measurements
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      activeView = button.dataset.view;
      render();
    });
  });

  document.getElementById("startPauseBtn").addEventListener("click", toggleTimer);
  document.getElementById("skipBtn").addEventListener("click", skipTimerSegment);
  document.getElementById("resetTimerBtn").addEventListener("click", resetTimer);
  document.getElementById("completeWorkoutBtn").addEventListener("click", completeToday);
  document.getElementById("toggleAllDetails").addEventListener("click", () => showToast("Tap any exercise name for form details."));

  document.body.addEventListener("click", (event) => {
    const exerciseButton = event.target.closest("[data-exercise]");
    if (exerciseButton) showExercise(exerciseButton.dataset.exercise);

    const waterButton = event.target.closest("[data-water]");
    if (waterButton) updateWater(Number(waterButton.dataset.water));

    const quickButton = event.target.closest("[data-quick]");
    if (quickButton) addQuickMeal(quickButton.dataset.quick);

    const deleteButton = event.target.closest("[data-delete-food]");
    if (deleteButton) deleteFood(deleteButton.dataset.deleteFood);
  });

  document.getElementById("closeModal").addEventListener("click", closeExercise);
  document.getElementById("exerciseModal").addEventListener("click", (event) => {
    if (event.target.id === "exerciseModal") closeExercise();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeExercise();
  });

  document.getElementById("measurementForm").addEventListener("submit", saveMeasurement);
  document.getElementById("foodForm").addEventListener("submit", saveFood);
  document.getElementById("resetDataBtn").addEventListener("click", resetAllData);
}

function render() {
  renderShell();
  renderToday();
  renderPlan();
  renderTrack();
  renderFood();
  renderTimer();
}

function renderShell() {
  const titles = {
    today: "Today",
    plan: "Plan",
    track: "Water",
    food: "Food",
    learn: "Learn"
  };
  const today = startOfDay(new Date());
  const cfg = getProgression(today);

  document.getElementById("screenTitle").textContent = titles[activeView];
  document.getElementById("topWeek").textContent = cfg.label;
  document.getElementById("topCountdown").textContent = `${daysUntilHoliday(today)} days`;

  document.querySelectorAll(".view").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === activeView);
  });

  document.querySelectorAll(".tab").forEach((button) => {
    const isActive = button.dataset.view === activeView;
    button.classList.toggle("active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function renderToday() {
  const today = startOfDay(new Date());
  const cfg = getProgression(today);
  const workout = getWorkoutForDate(today);
  const nextWorkout = getWorkoutForDate(addDays(today, 1));
  const complete = Boolean(state.completions[dateKey(today)]);

  document.getElementById("phasePill").textContent = cfg.phase;
  document.getElementById("todayTitle").textContent = workout.title;
  document.getElementById("todaySubtitle").textContent = workout.detail;
  document.getElementById("daysLeft").textContent = daysUntilHoliday(today);
  document.getElementById("sessionLength").textContent = estimateMinutes(workout, cfg);
  document.getElementById("streakCount").textContent = getStreak(today);
  document.getElementById("todayStatus").textContent = complete ? "Complete" : "Not complete";
  document.getElementById("completeWorkoutBtn").textContent = complete ? "Completed" : "Mark complete";
  document.getElementById("workoutFocus").textContent = workout.split;
  document.getElementById("nextWorkoutTitle").textContent = nextWorkout.title;
  document.getElementById("nextWorkoutMeta").textContent = `${dayName(addDays(today, 1))} - ${nextWorkout.split}`;

  const blocks = document.getElementById("todayBlocks");
  blocks.innerHTML = workout.blocks.map((block) => renderWorkoutBlock(block, cfg)).join("");
}

function renderWorkoutBlock(block, cfg) {
  const rounds = resolveRounds(block, cfg);
  const timing = block.kind === "warmup" ? "45s work" : block.kind === "cooldown" ? "easy pace" : `${cfg.work}s/${cfg.rest}s`;
  const meta = block.kind === "warmup" || block.kind === "cooldown" ? timing : `${rounds} rounds - ${timing}`;

  return `
    <article class="workout-block">
      <div class="block-header">
        <strong>${block.name}</strong>
        <span class="block-meta">${meta}</span>
      </div>
      <div class="exercise-list">
        ${block.exercises.map((name) => `
          <button class="exercise-card" data-exercise="${escapeAttr(name)}">
            <strong>${name}</strong>
            <span>${exerciseInfo[name]?.muscle || "Exercise"}</span>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function renderPlan() {
  const today = startOfDay(new Date());
  const cfg = getProgression(today);
  const weekStart = getCurrentPlanWeekStart(today);
  document.getElementById("planWeekTitle").textContent = `${cfg.label} schedule`;

  document.getElementById("progressionList").innerHTML = progression.map((item) => {
    const active = cfg.phase === "Holiday push" && cfg.weekNumber === item.week;
    return `
      <article class="progression-card ${active ? "current" : ""}">
        <h3>Week ${item.week}: ${item.title}</h3>
        <p>${item.work}s work, ${item.rest}s rest. ${item.note}</p>
      </article>
    `;
  }).join("");

  document.getElementById("weeklyPlan").innerHTML = workouts.map((workout, index) => {
    const planDate = addDays(weekStart, index);
    const key = dateKey(planDate);
    const isToday = key === dateKey(today);
    const complete = Boolean(state.completions[key]);
    const chips = workout.blocks
      .filter((block) => block.kind !== "warmup" && block.kind !== "cooldown")
      .flatMap((block) => block.exercises.slice(0, 2))
      .slice(0, 6);

    return `
      <article class="day-card ${isToday ? "today" : ""}">
        <p class="eyebrow">${dayName(planDate)} ${complete ? "- complete" : ""}</p>
        <h3>${workout.title}</h3>
        <p>${workout.detail}</p>
        <div>${chips.map((name) => `<button class="exercise-chip" data-exercise="${escapeAttr(name)}">${name}</button>`).join("")}</div>
      </article>
    `;
  }).join("");
}

function renderTrack() {
  const todayKey = dateKey(new Date());
  const water = state.water[todayKey] || 0;
  const waterPct = clamp((water / WATER_TARGET) * 100, 0, 100);

  document.getElementById("waterTotal").textContent = `${water} ml`;
  document.getElementById("waterMeter").style.width = `${waterPct}%`;
  document.getElementById("waterHint").textContent = water >= WATER_TARGET
    ? "Target hit. Add more if you are sweating heavily."
    : `Target: ${WATER_TARGET} ml today.`;

  const totalDone = Object.keys(state.completions).length;
  const weekDone = getCurrentWeekCompletionCount();
  const latest = getLatestMeasurement();
  const weightChange = latest && latest.weight ? round1(latest.weight - START_WEIGHT_KG) : 0;

  document.getElementById("progressStats").innerHTML = `
    <div><strong>${totalDone}</strong><span>workouts done</span></div>
    <div><strong>${weekDone}</strong><span>this week</span></div>
    <div><strong>${latest?.weight || START_WEIGHT_KG}</strong><span>latest kg</span></div>
    <div><strong>${weightChange > 0 ? "+" : ""}${weightChange}</strong><span>kg change</span></div>
  `;

  const entries = [...state.measurements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  document.getElementById("measurementList").innerHTML = entries.map((entry) => `
    <article class="entry-card">
      <div>
        <h3>${formatDateLabel(parseDateKey(entry.date))}</h3>
        <p>${entry.weight ? `${entry.weight} kg` : "No weight"}${entry.waist ? ` - ${entry.waist} cm waist` : ""}${entry.note ? ` - ${entry.note}` : ""}</p>
      </div>
    </article>
  `).join("");
}

function renderFood() {
  const todayKey = dateKey(new Date());
  const meals = state.food[todayKey] || [];
  const protein = meals.reduce((sum, meal) => sum + Number(meal.protein || 0), 0);
  const calories = meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
  const proteinPct = clamp((protein / PROTEIN_TARGET) * 100, 0, 100);

  document.getElementById("proteinTotal").textContent = `${protein} g`;
  document.getElementById("proteinMeter").style.width = `${proteinPct}%`;
  document.getElementById("proteinHint").textContent = calories
    ? `${protein} g protein logged, ${calories} calories entered. Target: ${PROTEIN_TARGET} g protein.`
    : `Target: ${PROTEIN_TARGET} g protein today.`;

  document.getElementById("foodList").innerHTML = meals.length
    ? meals.map((meal) => `
      <article class="entry-card">
        <div>
          <h3>${meal.type}: ${meal.name}</h3>
          <p>${meal.protein || 0} g protein${meal.calories ? ` - ${meal.calories} calories` : ""}</p>
        </div>
        <button class="icon-btn" data-delete-food="${meal.id}" aria-label="Delete ${escapeAttr(meal.name)}">Delete</button>
      </article>
    `).join("")
    : `<article class="entry-card"><div><h3>No food logged yet</h3><p>Start with one protein serving at your next meal.</p></div></article>`;
}

function renderTimer() {
  const current = timer.sequence[timer.index];
  const move = document.getElementById("timerMove");
  const block = document.getElementById("timerBlock");
  const next = document.getElementById("timerNext");
  const time = document.getElementById("timerTime");
  const startButton = document.getElementById("startPauseBtn");
  const ring = document.getElementById("timerRing");

  if (!current) {
    block.textContent = "Ready";
    move.textContent = "Start full workout timer";
    next.textContent = "Warm-up first, then the app will move through the session.";
    time.textContent = "00:00";
    ring.style.strokeDashoffset = RING_LENGTH;
    startButton.textContent = "Start";
    return;
  }

  const nextSegment = timer.sequence[timer.index + 1];
  const elapsedInSegment = timer.segmentLength - timer.remaining;
  const pct = timer.segmentLength ? clamp(elapsedInSegment / timer.segmentLength, 0, 1) : 0;

  block.textContent = `${current.block} - ${current.phase}`;
  move.textContent = current.name;
  next.textContent = nextSegment ? `Next: ${nextSegment.name}` : "Last step";
  time.textContent = formatTime(timer.remaining);
  ring.style.strokeDashoffset = String(RING_LENGTH * (1 - pct));
  startButton.textContent = timer.running ? "Pause" : "Start";
}

function toggleTimer() {
  if (!timer.sequence.length) {
    const today = startOfDay(new Date());
    timer.sequence = buildSequence(getWorkoutForDate(today), getProgression(today));
    timer.index = 0;
    timer.remaining = timer.sequence[0].seconds;
    timer.segmentLength = timer.sequence[0].seconds;
    timer.total = timer.sequence.reduce((sum, item) => sum + item.seconds, 0);
  }

  timer.running = !timer.running;
  if (timer.running) {
    timer.intervalId = window.setInterval(tickTimer, 1000);
  } else {
    window.clearInterval(timer.intervalId);
  }
  renderTimer();
}

function tickTimer() {
  timer.remaining -= 1;
  if (timer.remaining <= 0) nextTimerSegment();
  renderTimer();
}

function nextTimerSegment() {
  timer.index += 1;
  if (timer.index >= timer.sequence.length) {
    window.clearInterval(timer.intervalId);
    timer.running = false;
    timer.sequence = [];
    timer.index = 0;
    timer.remaining = 0;
    timer.segmentLength = 0;
    completeToday(true);
    showToast("Workout complete. Nice work.");
    render();
    return;
  }

  timer.remaining = timer.sequence[timer.index].seconds;
  timer.segmentLength = timer.sequence[timer.index].seconds;
}

function skipTimerSegment() {
  if (!timer.sequence.length) return;
  nextTimerSegment();
  renderTimer();
}

function resetTimer() {
  window.clearInterval(timer.intervalId);
  timer = {
    sequence: [],
    index: 0,
    remaining: 0,
    running: false,
    total: 0,
    segmentLength: 0,
    intervalId: null
  };
  renderTimer();
}

function buildSequence(workout, cfg) {
  const sequence = [];

  workout.blocks.forEach((block, blockIndex) => {
    const rounds = resolveRounds(block, cfg);
    const isWarmup = block.kind === "warmup";
    const isCooldown = block.kind === "cooldown";
    const workSeconds = isWarmup ? 45 : isCooldown ? 45 : cfg.work;
    const restSeconds = isWarmup ? 15 : isCooldown ? 0 : cfg.rest;

    for (let round = 1; round <= rounds; round += 1) {
      block.exercises.forEach((name, exerciseIndex) => {
        sequence.push({
          block: block.name,
          phase: isCooldown ? "Breathe" : "Work",
          name,
          seconds: workSeconds,
          round,
          rounds
        });

        const isLastExercise = exerciseIndex === block.exercises.length - 1;
        if (restSeconds > 0 && !(isLastExercise && round === rounds)) {
          sequence.push({
            block: block.name,
            phase: "Rest",
            name: "Rest",
            seconds: restSeconds,
            round,
            rounds
          });
        }
      });
    }

    if (blockIndex < workout.blocks.length - 1 && !isCooldown) {
      sequence.push({
        block: "Transition",
        phase: "Reset",
        name: "Breathe and set up",
        seconds: 45,
        round: 1,
        rounds: 1
      });
    }
  });

  if (!workout.recovery) {
    ["Child's Pose Breathing", "Hip Flexor Stretch", "Hamstring Fold", "Chest Opener"].forEach((name) => {
      sequence.push({
        block: "Cooldown",
        phase: "Breathe",
        name,
        seconds: 45,
        round: 1,
        rounds: 1
      });
    });
  }

  return sequence;
}

function completeToday(fromTimer = false) {
  const today = startOfDay(new Date());
  const key = dateKey(today);
  const workout = getWorkoutForDate(today);
  const cfg = getProgression(today);

  state.completions[key] = {
    workout: workout.title,
    completedAt: new Date().toISOString(),
    week: cfg.label
  };
  saveState();
  if (!fromTimer) showToast("Workout marked complete.");
  render();
}

function updateWater(amount) {
  const key = dateKey(new Date());
  const next = Math.max(0, (state.water[key] || 0) + amount);
  state.water[key] = next;
  saveState();
  renderTrack();
  if (next >= WATER_TARGET) showToast("Water target hit.");
}

function saveMeasurement(event) {
  event.preventDefault();
  const weight = Number(document.getElementById("weightInput").value);
  const waist = Number(document.getElementById("waistInput").value);
  const note = document.getElementById("measureNote").value.trim();

  if (!weight && !waist && !note) {
    showToast("Add a weight, waist, or note first.");
    return;
  }

  state.measurements.push({
    id: String(Date.now()),
    date: dateKey(new Date()),
    weight: weight || "",
    waist: waist || "",
    note
  });
  saveState();
  event.target.reset();
  renderTrack();
  showToast("Check-in saved.");
}

function saveFood(event) {
  event.preventDefault();
  const type = document.getElementById("mealType").value;
  const name = document.getElementById("foodName").value.trim();
  const protein = Number(document.getElementById("proteinInput").value);
  const calories = Number(document.getElementById("calorieInput").value);

  if (!name) {
    showToast("Add the food name first.");
    return;
  }

  addFood({ type, name, protein: protein || 0, calories: calories || "" });
  event.target.reset();
}

function addQuickMeal(key) {
  addFood(quickMeals[key]);
}

function addFood(meal) {
  const todayKey = dateKey(new Date());
  if (!state.food[todayKey]) state.food[todayKey] = [];
  state.food[todayKey].push({
    id: String(Date.now()),
    ...meal
  });
  saveState();
  renderFood();
  showToast("Food added.");
}

function deleteFood(id) {
  const todayKey = dateKey(new Date());
  state.food[todayKey] = (state.food[todayKey] || []).filter((meal) => meal.id !== id);
  saveState();
  renderFood();
}

function resetAllData() {
  const ok = window.confirm("Reset all workout, water, food, and progress data on this device?");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  resetTimer();
  render();
  showToast("App data reset.");
}

function showExercise(name) {
  const info = exerciseInfo[name];
  if (!info) return;
  document.getElementById("modalMuscle").textContent = info.muscle;
  document.getElementById("modalTitle").textContent = name;
  document.getElementById("modalHow").textContent = info.how;
  document.getElementById("modalCues").innerHTML = info.cues.map((cue) => `<li>${cue}</li>`).join("");
  document.getElementById("modalAdjust").textContent = info.adjust;
  document.getElementById("exerciseModal").hidden = false;
}

function closeExercise() {
  document.getElementById("exerciseModal").hidden = true;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function getWorkoutForDate(date) {
  const start = parseDateKey(state.planStart);
  const offset = Math.max(0, daysBetween(start, startOfDay(date)));
  return workouts[offset % workouts.length];
}

function getProgression(date) {
  const start = parseDateKey(state.planStart);
  const today = startOfDay(date);
  const weekNumber = Math.max(1, Math.floor(Math.max(0, daysBetween(start, today)) / 7) + 1);

  if (today <= HOLIDAY_DATE && weekNumber <= progression.length) {
    return {
      ...progression[weekNumber - 1],
      weekNumber,
      label: `Week ${weekNumber}`,
      phase: "Holiday push"
    };
  }

  const afterStart = addDays(HOLIDAY_DATE, 1);
  const afterWeek = Math.max(1, Math.floor(Math.max(0, daysBetween(afterStart, today)) / 7) + 1);
  const item = ongoingProgression[(afterWeek - 1) % ongoingProgression.length];
  return {
    ...item,
    weekNumber: afterWeek,
    label: `Build ${((afterWeek - 1) % ongoingProgression.length) + 1}`,
    phase: "Keep building"
  };
}

function resolveRounds(block, cfg) {
  if (block.roundsKey) return cfg[block.roundsKey] || 1;
  return block.rounds || 1;
}

function estimateMinutes(workout, cfg) {
  const seconds = buildSequence(workout, cfg).reduce((sum, item) => sum + item.seconds, 0);
  return Math.round(seconds / 60);
}

function getCurrentPlanWeekStart(date) {
  const start = parseDateKey(state.planStart);
  const offset = Math.max(0, daysBetween(start, startOfDay(date)));
  const currentWeek = Math.floor(offset / 7);
  return addDays(start, currentWeek * 7);
}

function getCurrentWeekCompletionCount() {
  const today = startOfDay(new Date());
  const weekStart = getCurrentPlanWeekStart(today);
  let count = 0;
  for (let i = 0; i < 7; i += 1) {
    if (state.completions[dateKey(addDays(weekStart, i))]) count += 1;
  }
  return count;
}

function getStreak(today) {
  let count = 0;
  let cursor = startOfDay(today);
  if (!state.completions[dateKey(cursor)]) cursor = addDays(cursor, -1);

  while (state.completions[dateKey(cursor)]) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

function getLatestMeasurement() {
  return [...state.measurements]
    .filter((entry) => entry.weight || entry.waist || entry.note)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function daysUntilHoliday(date) {
  return Math.max(0, Math.ceil((startOfDay(HOLIDAY_DATE) - startOfDay(date)) / DAY_MS));
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

function daysBetween(start, end) {
  return Math.round((startOfDay(end) - startOfDay(start)) / DAY_MS);
}

function dateKey(date) {
  const local = startOfDay(date);
  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, "0");
  const day = String(local.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dayName(date) {
  return date.toLocaleDateString(undefined, { weekday: "long" });
}

function formatDateLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}
