import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MediaDetails } from "../types";
import { apiFetch } from "../api";
import DetailCard from "../components/DetailCard";

interface DetailPageProps {
  type: "movie" | "tv";
}

const DetailPage: React.FC<DetailPageProps> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await apiFetch(`/${type}/${id}`, {
          append_to_response: "videos,credits,watch/providers,images",
        });
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id, type]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Details not found.</p>
      </div>
    );
  }

  return <DetailCard details={details} />;
};

export default DetailPage;
