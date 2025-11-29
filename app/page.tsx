import PollList from "@/app/components/polls/PollList";
import PollSearchBar from "@/app/components/polls/PollSearchBar";
import PollsHydrator from "@/app/components/polls/PollsHydrator";
import Link from "next/link";
import { fetchPollsRequest } from "@/app/lib/api/polls";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function LandingPage() {
  let polls = [];

  try {
    polls = await fetchPollsRequest();
  } catch (err) {
    console.error("Failed to fetch polls", err);
  }

  return (
    <div className="px-6 py-12 space-y-16">

      {/* HERO */}
      <section className="space-y-6 md:mx-16 bg-white shadow-sm rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 italic">
          Create instant polls. See results live.
        </h1>

        <p className="text-md md:text-xl text-slate-600 space-y-10 leading-relaxed">
          Quickly create shareable polls and watch responses update in real-time.
        </p>

        <div className="mt-12">
          <Link
            href="/create"
            className="px-6 py-3 rounded-md w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            Create a Poll
          </Link>
        </div>
      </section>

      {/* Hydrate Redux */}
      <PollsHydrator polls={polls} />

      {/* Search / Filter */}
      <PollSearchBar />

      {/* List */}
      <PollList />
    </div>
  );
}
