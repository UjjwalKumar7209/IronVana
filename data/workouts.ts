export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  image: string;
  instructions: {
    start: string;
    movement: string;
    breathing: string;
    mistakes: string;
  };
};

export type Workout = {
  day: number;
  title: string;
  eyebrow: string;
  exercises: Exercise[];
};

const exerciseImageFiles: Record<string, string> = {
  "hamstring curl": "Lying_Leg_Curls",
  "leg extension": "Leg_Extensions",
  squat: "Barbell_Squat",
  deadlift: "Romanian_Deadlift",
  "calf raise": "Standing_Calf_Raises",
  "cable row": "Seated_Cable_Rows",
  "bench row": "Bent_Over_Two-Dumbbell_Row",
  "lat pulldown": "Full_Range-Of-Motion_Lat_Pulldown",
  "lat pullover": "Bent-Arm_Dumbbell_Pullover",
  shrug: "Barbell_Shrug",
  "preacher curl": "Preacher_Curl",
  "dumbbell curl": "Standing_One-Arm_Dumbbell_Curl_Over_Incline_Bench",
  "hammer curl": "Hammer_Curls",
  "chest press": "Dumbbell_Bench_Press",
  "incline press": "Hammer_Grip_Incline_DB_Bench_Press",
  "overhead press": "Barbell_Shoulder_Press",
  "pec fly": "Butterfly",
  "lateral raise": "Side_Lateral_Raise",
  "tricep kickback": "Cable_One_Arm_Tricep_Extension",
  "tricep pushdown": "Triceps_Pushdown",
  "tricep extension": "Cable_Rope_Overhead_Triceps_Extension",
  "seated row": "Seated_Cable_Rows",
  "supported row": "Bent_Over_Two-Dumbbell_Row",
  "single arm row": "Seated_One-arm_Cable_Pulley_Rows",
  "rear delt fly": "Cable_Rear_Delt_Fly",
  "cable curl": "Standing_Biceps_Cable_Curl",
};
const image = (label: string) =>
  `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseImageFiles[label] ?? "Dumbbell_Bench_Press"}/0.jpg`;

const make = (
  id: string,
  name: string,
  muscle: string,
  label: string,
  _accent = "d3f36b",
): Exercise => ({
  id,
  name,
  muscle,
  image: image(label),
  instructions: {
    start:
      "Set your posture tall, brace your core, and choose a weight you can control.",
    movement:
      "Move smoothly through the full range. Pause briefly at the point of peak tension.",
    breathing:
      "Breathe out through the effort and inhale as you return to the start.",
    mistakes:
      "Avoid swinging, shrugging, or shortening the range to move more weight.",
  },
});
const legs = [
  make("hamstring-curl", "Hamstring Curl", "Hamstrings", "hamstring curl"),
  make("leg-extension", "Leg Extension", "Quads", "leg extension"),
  make("squats", "Squats", "Quads · Glutes", "squat", "f5a46b"),
  make(
    "romanian-deadlift",
    "Romanian Deadlift",
    "Hamstrings · Glutes",
    "deadlift",
    "f5a46b",
  ),
  make("calf-raise", "Calf Raise", "Calves", "calf raise"),
];

export const workouts: Workout[] = [
  {
    day: 1,
    title: "Back + Biceps",
    eyebrow: "Pull strength",
    exercises: [
      make(
        "unilateral-high-low-row",
        "Unilateral High-to-Low Cable Row",
        "Back",
        "cable row",
      ),
      make("bench-row", "Bench Row", "Back", "bench row"),
      make(
        "neutral-lat-pulldown",
        "Neutral-Grip Lat Pulldown",
        "Lats",
        "lat pulldown",
      ),
      make("cable-row", "Cable Row", "Mid back", "cable row"),
      make("cable-lat-pullover", "Cable Lat Pullover", "Lats", "lat pullover"),
      make("shrugs", "Shrugs", "Traps", "shrug"),
      make(
        "preacher-curl",
        "Preacher Curl",
        "Biceps",
        "preacher curl",
        "f5a46b",
      ),
      make(
        "decline-dumbbell-curl",
        "Decline Dumbbell Curl",
        "Biceps",
        "dumbbell curl",
        "f5a46b",
      ),
      make(
        "seated-hammer-curl",
        "Seated Hammer Curl",
        "Brachialis",
        "hammer curl",
        "f5a46b",
      ),
    ],
  },
  {
    day: 2,
    title: "Chest + Delts + Triceps",
    eyebrow: "Push strength",
    exercises: [
      make(
        "machine-dumbbell-chest-press",
        "Machine/Dumbbell Chest Press",
        "Chest",
        "chest press",
        "f5a46b",
      ),
      make(
        "incline-dumbbell-press",
        "Incline Dumbbell Press",
        "Upper chest",
        "incline press",
        "f5a46b",
      ),
      make(
        "overhead-press",
        "Overhead Press",
        "Shoulders",
        "overhead press",
        "d3f36b",
      ),
      make("pec-fly", "Pec Fly", "Chest", "pec fly", "f5a46b"),
      make(
        "lateral-raise",
        "Lateral Raise",
        "Side delts",
        "lateral raise",
        "d3f36b",
      ),
      make(
        "unilateral-cable-tricep-kickback",
        "Unilateral Cable Tricep Kickback",
        "Triceps",
        "tricep kickback",
        "d3f36b",
      ),
      make(
        "tricep-rod-pushdown",
        "Tricep Rod Pushdown",
        "Triceps",
        "tricep pushdown",
        "d3f36b",
      ),
      make(
        "overhead-tricep-extension",
        "Overhead Tricep Extension",
        "Triceps",
        "tricep extension",
        "d3f36b",
      ),
    ],
  },
  { day: 3, title: "Legs", eyebrow: "Lower body", exercises: legs },
  {
    day: 4,
    title: "Back + Rear Delt + Biceps",
    eyebrow: "Pull strength",
    exercises: [
      make(
        "neutral-lat-pulldown-4",
        "Neutral-Grip Lat Pulldown",
        "Lats",
        "lat pulldown",
      ),
      make("seated-cable-row", "Seated Cable Row", "Mid back", "seated row"),
      make(
        "chest-supported-row",
        "Chest-Supported Row",
        "Mid back",
        "supported row",
      ),
      make(
        "single-arm-cable-row",
        "Single-Arm Cable Row",
        "Back",
        "single arm row",
      ),
      make(
        "rear-delt-fly",
        "Rear Delt Fly",
        "Rear delts",
        "rear delt fly",
        "d3f36b",
      ),
      make(
        "cable-bicep-curl",
        "Cable Bicep Curl",
        "Biceps",
        "cable curl",
        "f5a46b",
      ),
      make(
        "decline-dumbbell-curl-4",
        "Decline Dumbbell Curl",
        "Biceps",
        "dumbbell curl",
        "f5a46b",
      ),
      make(
        "seated-hammer-curl-4",
        "Seated Hammer Curl",
        "Brachialis",
        "hammer curl",
        "f5a46b",
      ),
    ],
  },
  {
    day: 5,
    title: "Chest + Delts + Triceps",
    eyebrow: "Push strength",
    exercises: [
      make("pec-fly-machine", "Pec Fly Machine", "Chest", "pec fly", "f5a46b"),
      make(
        "incline-dumbbell-press-5",
        "Incline Dumbbell Press",
        "Upper chest",
        "incline press",
        "f5a46b",
      ),
      make(
        "dumbbell-chest-press",
        "Dumbbell Chest Press",
        "Chest",
        "chest press",
        "f5a46b",
      ),
      make(
        "lateral-dumbbell-raises",
        "Lateral Dumbbell Raises",
        "Side delts",
        "lateral raise",
        "d3f36b",
      ),
      make(
        "tricep-rod-pushdown-5",
        "Tricep Rod Pushdown",
        "Triceps",
        "tricep pushdown",
        "d3f36b",
      ),
      make(
        "unilateral-tricep-overhead-extension",
        "Unilateral Tricep Overhead Extension",
        "Triceps",
        "tricep extension",
        "d3f36b",
      ),
    ],
  },
  {
    day: 6,
    title: "Legs",
    eyebrow: "Lower body",
    exercises: legs.map((exercise) => ({
      ...exercise,
      id: `${exercise.id}-6`,
    })),
  },
];

export const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export const weekdayToWeekIndex = (weekday: number) =>
  weekday === 0 ? 6 : weekday - 1;
export const weekIndexToWeekday = (index: number) =>
  index === 6 ? 0 : index + 1;
export const workoutForWeekday = (weekday: number) =>
  weekday === 1 ? null : workouts[weekday === 0 ? 5 : weekday - 2];
