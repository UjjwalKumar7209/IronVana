"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Dumbbell,
  History,
  Home as HomeIcon,
  Info,
  Menu,
  Moon,
  MoreHorizontal,
  Play,
  RotateCcw,
  Settings,
  StickyNote,
  Sun,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import {
  dayNames,
  weekdayToWeekIndex,
  weekIndexToWeekday,
  workoutForWeekday,
  type Exercise,
} from "../data/workouts";
import {
  allProgress,
  clearAllProgress,
  clearProgress,
  readProgress,
  saveProgress,
  type Progress,
} from "../lib/workoutStorage";

type Tab = "today" | "week" | "history" | "settings";
const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
const dateAt = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
};

export default function Home() {
  const [tab, setTab] = useState<Tab>("today");
  const [date, setDate] = useState(new Date());
  const [progress, setProgress] = useState<Progress>({});
  const [dark, setDark] = useState(true);
  const [detail, setDetail] = useState<Exercise | null>(null);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const weekday = date.getDay();
  const workout = workoutForWeekday(weekday);
  const dateId = dateKey(date);
  useEffect(() => {
    setProgress(readProgress(dateId));
  }, [dateId]);
  useEffect(() => {
    setUserName(localStorage.getItem("ironvana-user-name") || "");
  }, []);
  useEffect(() => {
    const listener = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", listener);
    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);
  const stats = useMemo(() => {
    const total = workout?.exercises.length ?? 0;
    const sets =
      workout?.exercises.reduce(
        (n, e) => n + (progress[e.id]?.sets.filter(Boolean).length ?? 0),
        0,
      ) ?? 0;
    const done =
      workout?.exercises.filter((e) => progress[e.id]?.sets.every(Boolean))
        .length ?? 0;
    return {
      total,
      sets,
      done,
      totalSets: total * 2,
      percent: totalSets(total) ? Math.round((sets / (total * 2)) * 100) : 0,
    };
  }, [workout, progress]);
  const toggleExercise = (id: string) => {
    const completed = progress[id]?.sets?.every(Boolean);
    const next = {
      ...progress,
      [id]: {
        ...progress[id],
        sets: completed ? [false, false] : [true, true],
      },
    };
    saveProgress(dateId, next);
    setProgress(next);
  };
  const editNote = (id: string) => {
    const note = window.prompt(
      "Add a note for this exercise",
      progress[id]?.note ?? "",
    );
    if (note === null) return;
    const next = {
      ...progress,
      [id]: { sets: progress[id]?.sets ?? [false, false], note },
    };
    saveProgress(dateId, next);
    setProgress(next);
  };
  const completeAll = (id: string) => {
    const next = { ...progress, [id]: { ...progress[id], sets: [true, true] } };
    saveProgress(dateId, next);
    setProgress(next);
  };
  const reset = () => {
    clearProgress(dateId);
    setProgress({});
  };
  const nav = (next: Tab) => setTab(next);
  return (
    <main className={dark ? "" : "light"}>
      <aside className="desktop-nav">
        <Logo />
        <nav>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={tab === item.id}
              onClick={() => nav(item.id)}
            />
          ))}
        </nav>
        <Profile name={userName} />
      </aside>
      <div className="app-shell">
        <header>
          <div className="mobile-logo">
            <Logo />
          </div>
          <div className="header-title">
            <span>IRONVANA / {tab.toUpperCase()}</span>
            <strong>
              {tab === "today"
                ? "Train with intent."
                : tab === "week"
                  ? "Your weekly rhythm."
                  : tab === "history"
                    ? "Every session counts."
                    : "Make it yours."}
            </strong>
          </div>
          <button className="icon-button">
            <Menu size={20} />
          </button>
        </header>
        <div className="content">
          {tab === "today" && (
            <Today
              date={date}
              workout={workout}
              progress={progress}
              stats={stats}
              detail={setDetail}
              note={editNote}
              toggleExercise={toggleExercise}
              setTab={setTab}
            />
          )}{" "}
          {tab === "week" && <Week date={date} setDate={setDate} />}{" "}
          {tab === "history" && <HistoryView />}{" "}
          {tab === "settings" && (
            <SettingsView
              dark={dark}
              setDark={setDark}
              reset={reset}
              installEvent={installEvent}
            />
          )}
        </div>
      </div>
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={tab === item.id}
            onClick={() => nav(item.id)}
          />
        ))}
      </nav>
      {detail && (
        <ExerciseModal exercise={detail} close={() => setDetail(null)} />
      )}{" "}
      {userName === "" && (
        <WelcomeModal
          save={(name) => {
            localStorage.setItem("ironvana-user-name", name);
            setUserName(name);
          }}
        />
      )}
    </main>
  );
}
const totalSets = (total: number) => total * 2;
function Logo() {
  return (
    <div className="logo">
      <div className="logo-mark">
        <Dumbbell size={20} />
      </div>
      <span>IRONVANA</span>
    </div>
  );
}
function Profile({ name }: { name?: string }) {
  const display = name || "Athlete";
  const initials = display.slice(0, 2).toUpperCase();
  return (
    <div className="side-foot">
      <div className="avatar">{initials}</div>
      <div>
        <strong>{display}</strong>
        <span>Personal Workout</span>
      </div>
      <MoreHorizontal size={17} />
    </div>
  );
}
const navItems: { id: Tab; label: string; icon: typeof HomeIcon }[] = [
  { id: "today", label: "Today", icon: HomeIcon },
  { id: "week", label: "Week", icon: CalendarDays },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];
function NavItem({
  item,
  active,
  onClick,
}: {
  item: { id: Tab; label: string; icon: typeof HomeIcon };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      className={active ? "nav-item active" : "nav-item"}
      onClick={onClick}
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </button>
  );
}
function Today({
  date,
  workout,
  progress,
  stats,
  detail,
  note,
  toggleExercise,
  setTab,
}: {
  date: Date;
  workout: ReturnType<typeof workoutForWeekday>;
  progress: Progress;
  stats: {
    total: number;
    sets: number;
    done: number;
    totalSets: number;
    percent: number;
  };
  detail: (exercise: Exercise) => void;
  note: (id: string) => void;
  toggleExercise: (id: string) => void;
  setTab: (tab: Tab) => void;
}) {
  if (!workout) return <RestDay date={date} setTab={setTab} />;
  return (
    <>
      <section className="hero">
        <div>
          <p className="kicker">{formatDate(date)}</p>
          <h1>
            Day {workout.day}
            <span>/ 06</span>
          </h1>
          <p className="hero-sub">{workout.title}</p>
        </div>
        <div className="hero-badge">
          <Activity size={19} />
          <span>Training day</span>
        </div>
      </section>
      <section className="progress-panel">
        <div className="progress-heading">
          <div>
            <span className="label">SESSION PROGRESS</span>
            <strong>{stats.percent}%</strong>
          </div>
          <div className="progress-count">
            <b>{stats.done}</b>/{stats.total} exercises <i />{" "}
            <b>{stats.sets}</b>/{stats.totalSets} sets
          </div>
        </div>
        <div className="progress-track">
          <div style={{ width: `${stats.percent}%` }} />
        </div>
      </section>
      <div className="section-heading">
        <div>
          <span className="label">THE WORKOUT</span>
          <h2>{workout.eyebrow}</h2>
        </div>
        <span className="set-rule">2 working sets each</span>
      </div>
      <div className="exercise-list">
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            progress={progress[exercise.id]}
            detail={() => detail(exercise)}
            note={() => note(exercise.id)}
            toggleExercise={toggleExercise}
          />
        ))}
      </div>
    </>
  );
}
function ExerciseCard({
  exercise,
  index,
  progress,
  detail,
  note,
  toggleExercise,
}: {
  exercise: Exercise;
  index: number;
  progress?: { sets: boolean[]; note?: string };
  detail: () => void;
  note: () => void;
  toggleExercise: (id: string) => void;
}) {
  const completed = progress?.sets?.every(Boolean);
  return (
    <article
      className={completed ? "exercise-card completed" : "exercise-card"}
    >
      <ExerciseVisual exercise={exercise} index={index} />
      <div className="exercise-main">
        <div className="exercise-title">
          <div>
            <h3>{exercise.name}</h3>
            <span>{exercise.muscle}</span>
          </div>
          <div className="card-actions">
            <button
              className={progress?.note ? "more-button noted" : "more-button"}
              onClick={note}
              aria-label={`Add note for ${exercise.name}`}
            >
              <StickyNote size={17} />
            </button>
            <button
              className="more-button"
              onClick={detail}
              aria-label={`How to perform ${exercise.name}`}
            >
              <CircleHelp size={19} />
            </button>
          </div>
        </div>
        <div className="set-row">
          <span className="set-rule">2 working sets</span>
          <button
            className={
              completed ? "complete-button completed-action" : "complete-button"
            }
            onClick={() => toggleExercise(exercise.id)}
          >
            <span className="exercise-check">
              {completed && <Check size={14} />}
            </span>
            {completed ? "Completed" : "Complete exercise"}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
function ExerciseVisual({
  exercise,
  index,
  className = "exercise-image",
}: {
  exercise: Exercise;
  index?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`${className} ${failed ? "image-failed" : ""}`}>
      <img
        src={exercise.image}
        alt={`${exercise.name} exercise reference`}
        onError={() => setFailed(true)}
      />
      {index !== undefined && (
        <span className="exercise-index">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      {failed && <span className="image-fallback">{exercise.name}</span>}
    </div>
  );
}
function RestDay({ date, setTab }: { date: Date; setTab: (tab: Tab) => void }) {
  const next = workoutForWeekday(1);
  return (
    <>
      <section className="rest-hero">
        <div className="rest-orbit">
          <Moon size={34} />
        </div>
        <p className="kicker">{formatDate(date)}</p>
        <h1>
          Rest day<span>.</span>
        </h1>
        <p>Recover today. Come back stronger tomorrow.</p>
      </section>
      <section className="next-card">
        <div>
          <span className="label">UP NEXT / TUESDAY</span>
          <h2>Day 1 · {next?.title}</h2>
        </div>
        <Timer size={22} />
      </section>
      <div className="section-heading">
        <div>
          <span className="label">YOUR WEEK</span>
          <h2>Keep the rhythm</h2>
        </div>
      </div>
      <WeekStrip selected={0} onSelect={() => setTab("week")} />
    </>
  );
}
function Week({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const selectedWorkout = workoutForWeekday(date.getDay());
  return (
    <>
      <section className="page-intro">
        <span className="label">TRAINING CALENDAR</span>
        <h1>
          This week<span>.</span>
        </h1>
        <p>Six focused sessions. One day to recover.</p>
      </section>
      <WeekStrip
        selected={weekdayToWeekIndex(date.getDay())}
        onSelect={(day) => {
          const next = new Date();
          const targetWeekday = weekIndexToWeekday(day);
          const delta = targetWeekday - next.getDay();
          next.setDate(next.getDate() + delta);
          setDate(next);
        }}
      />
      <div className="week-detail">
        <span className="label">
          {dayNames[weekdayToWeekIndex(date.getDay())].toUpperCase()}{" "}
          {selectedWorkout && `· DAY ${selectedWorkout.day}`}
        </span>
        <h2>{selectedWorkout?.title ?? "Rest day"}</h2>
        <p>{formatDate(date)}</p>
        {selectedWorkout ? (
          <ul className="week-exercises">
            {selectedWorkout.exercises.map((exercise) => (
              <li key={exercise.id}>
                <span>{exercise.name}</span>
                <b>2 sets</b>
              </li>
            ))}
          </ul>
        ) : (
          <div className="week-rest-note">
            Recover today. Come back stronger tomorrow.
          </div>
        )}
      </div>
    </>
  );
}
function WeekStrip({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (day: number) => void;
}) {
  return (
    <div className="week-strip">
      {dayNames.map((name, index) => {
        const workout = workoutForWeekday(weekIndexToWeekday(index));
        return (
          <button
            key={name}
            onClick={() => onSelect(index)}
            className={selected === index ? "day-cell selected" : "day-cell"}
          >
            <span>{name.slice(0, 3).toUpperCase()}</span>
            <b>{workout?.day ?? "—"}</b>
            <small>{workout ? "TRAIN" : "REST"}</small>
          </button>
        );
      })}
    </div>
  );
}
function HistoryView() {
  const [entries, setEntries] = useState<
    { date: string; percent: number; sets: number; title: string }[]
  >([]);
  useEffect(() => {
    const data = allProgress()
      .map(({ date, progress }) => {
        const parsed = new Date(`${date}T12:00:00`);
        const workout = workoutForWeekday(parsed.getDay());
        const total = workout?.exercises.length ?? 0;
        const sets = Object.values(progress).reduce(
          (sum, item) => sum + item.sets.filter(Boolean).length,
          0,
        );
        return {
          date,
          percent: total ? Math.round((sets / (total * 2)) * 100) : 0,
          sets,
          title: workout ? `Day ${workout.day} · ${workout.title}` : "Rest day",
        };
      })
      .filter((entry) => entry.percent > 0)
      .sort((a, b) => b.date.localeCompare(a.date));
    setEntries(data);
  }, []);
  const totalSets = entries.reduce((sum, entry) => sum + entry.sets, 0);
  return (
    <>
      <section className="page-intro">
        <span className="label">YOUR LOGBOOK</span>
        <h1>
          History<span>.</span>
        </h1>
        <p>Your consistency, in plain sight.</p>
      </section>
      <div className="stats-grid">
        <Stat label="Workouts" value={String(entries.length)} />
        <Stat label="Sets completed" value={String(totalSets)} />
        <Stat
          label="Current streak"
          value={`${entries.length ? 1 : 0} day${entries.length === 1 ? "" : "s"}`}
        />
      </div>
      {entries.length ? (
        <div className="history-list">
          {entries.map((entry) => (
            <div className="history-row" key={entry.date}>
              <div>
                <span>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                  }).format(new Date(`${entry.date}T12:00:00`))}
                </span>
                <strong>{entry.title}</strong>
              </div>
              <b>{entry.percent}%</b>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-history">
          <History size={27} />
          <h2>Your next session starts here.</h2>
          <p>
            Complete a workout and your progress will appear in this logbook.
          </p>
        </div>
      )}
    </>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function SettingsView({
  dark,
  setDark,
  reset,
  installEvent,
}: {
  dark: boolean;
  setDark: (value: boolean) => void;
  reset: () => void;
  installEvent: BeforeInstallPromptEvent | null;
}) {
  const install = async () => {
    if (installEvent) {
      await installEvent.prompt();
    }
  };
  const clearHistory = () => {
    if (
      window.confirm("Clear all saved workout history? This cannot be undone.")
    ) {
      clearAllProgress();
      window.location.reload();
    }
  };
  return (
    <>
      <section className="page-intro">
        <span className="label">PREFERENCES</span>
        <h1>
          Settings<span>.</span>
        </h1>
        <p>A few controls for your personal practice.</p>
      </section>
      <div className="settings-list">
        <button className="setting-row" onClick={() => setDark(!dark)}>
          <div className="setting-icon">
            <Sun size={18} />
          </div>
          <div>
            <strong>Appearance</strong>
            <span>{dark ? "Dark mode" : "Light mode"}</span>
          </div>
          <span className="switch">
            <i className={dark ? "on" : ""} />
          </span>
        </button>
        {installEvent && (
          <button className="setting-row" onClick={install}>
            <div className="setting-icon">
              <Play size={18} />
            </div>
            <div>
              <strong>Install IronVana</strong>
              <span>Add it to your home screen</span>
            </div>
            <ChevronRight size={18} />
          </button>
        )}
        <button className="setting-row" onClick={reset}>
          <div className="setting-icon">
            <RotateCcw size={18} />
          </div>
          <div>
            <strong>Reset today</strong>
            <span>Clear this session's progress</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button className="setting-row" onClick={clearHistory}>
          <div className="setting-icon">
            <Trash2 size={18} />
          </div>
          <div>
            <strong>Clear all history</strong>
            <span>Remove every saved workout</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <div className="setting-row about">
          <div className="setting-icon">
            <Info size={18} />
          </div>
          <div>
            <strong>IronVana</strong>
            <span>Built for the next set · v1.0</span>
          </div>
        </div>
      </div>
    </>
  );
}
function ExerciseModal({
  exercise,
  close,
}: {
  exercise: Exercise;
  close: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={close}>
          <X size={19} />
        </button>
        <ExerciseVisual exercise={exercise} className="modal-image" />
        <span className="label">HOW TO PERFORM</span>
        <h2>{exercise.name}</h2>
        <div className="instruction-grid">
          <Instruction title="Start" text={exercise.instructions.start} />
          <Instruction title="Move" text={exercise.instructions.movement} />
          <Instruction title="Breathe" text={exercise.instructions.breathing} />
          <Instruction title="Avoid" text={exercise.instructions.mistakes} />
        </div>
      </div>
    </div>
  );
}
function Instruction({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <span>{title}</span>
      <p>{text}</p>
    </div>
  );
}
function WelcomeModal({ save }: { save: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="modal-backdrop welcome-backdrop">
      <div className="welcome-modal">
        <div className="logo-mark">
          <Dumbbell size={20} />
        </div>
        <span className="label">WELCOME TO IRONVANA</span>
        <h2>What should we call you?</h2>
        <p>Your name will only appear in your profile.</p>
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && name.trim()) save(name.trim());
          }}
          placeholder="Enter your name"
        />
        <button disabled={!name.trim()} onClick={() => save(name.trim())}>
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> };
