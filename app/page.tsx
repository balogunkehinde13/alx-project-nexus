import PollList from "@/app/components/polls/PollList";
import PollSearchBar from "@/app/components/polls/PollSearchBar";
import PollsHydrator from "@/app/components/polls/PollsHydrator";
import Link from "next/link";
import { fetchPollsRequest } from "@/app/lib/api/polls";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function LandingPage() {
  let polls = [];

  try {
    polls = await fetchPollsRequest();
  } catch (err) {
    console.error("Failed to fetch polls", err);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">

      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Create Instant Polls</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Create polls, share them with anyone, and watch results in real-time.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link href="/create" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            Create a Poll
          </Link>
        </div>
      </section>

      {/* 🔥 Hydrate Redux BEFORE search / list components */}
      <PollsHydrator polls={polls} />

      {/* Search & Filter */}
      <PollSearchBar />

      {/* List */}
      <PollList />
    </div>
  );
}
