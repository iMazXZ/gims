import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PersonDetails, PersonCredits } from "../types";
import { apiFetch } from "../api";
import MediaRow from "../components/MediaRow";

const PersonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [credits, setCredits] = useState<PersonCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPersonData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [personRes, creditsRes] = await Promise.all([
          apiFetch(`/person/${id}`),
          apiFetch(`/person/${id}/combined_credits`),
        ]);
        setPerson(personRes);
        setCredits(creditsRes);
      } catch (error) {
        console.error("Failed to fetch person data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPersonData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Person not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in-up max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : "/placeholder.png"
            }
            alt={person.name}
            className="rounded-lg w-full"
          />
        </div>
        <div className="md:col-span-9">
          <h1 className="text-5xl font-display tracking-wider">
            {person.name}
          </h1>
          <p className="text-brand-text-secondary mt-1">
            {person.known_for_department}
          </p>
          <div className="mt-4">
            <h2 className="text-2xl font-display">Biography</h2>
            <p className="text-brand-text-secondary mt-2 leading-relaxed max-h-60 overflow-y-auto">
              {person.biography || "No biography available."}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12">
        {credits && <MediaRow title="Known For" items={credits.cast} />}
      </div>
    </div>
  );
};

export default PersonPage;
