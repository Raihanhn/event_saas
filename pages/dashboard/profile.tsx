//pages/dashboard/profile.tsx

"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Edit, UploadCloud, User, Phone, MapPin, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: "admin" | "team";
  profileImage?: string;
}

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch profile once
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/auth/me", { headers: { "Cache-Control": "no-cache" } });
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading || !profile) return <div className="flex items-center justify-center h-[70vh]">Loading...</div>;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setProfileImage(e.target.files[0]);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      if (profileImage) formData.append("profileImage", profileImage);
      formData.append("data", JSON.stringify({
        name: profile?.name,
        phone: profile?.phone ?? "",
        location: profile?.location ?? "",
      }));

      const res = await axios.put("/api/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.user) {
        setProfile(res.data.user);
        setUser(res.data.user); // update global context (Header updates)
        toast.success("Profile updated successfully");
      }

      setEditing(false);
      setProfileImage(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-2xl border p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
        {/* Avatar */}
        <div className="flex flex-col items-center justify-center rounded-xl p-6 bg-gray-50 dark:bg-gray-900">
          <div className="relative">
            <img
              src={profileImage ? URL.createObjectURL(profileImage) : profile.profileImage || "/avatar/avatar.jpg"}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border"
            />
            {editing && (
              <label className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full cursor-pointer shadow">
                <UploadCloud size={16} className="text-white" />
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-center capitalize">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-sm text-gray-400 capitalize">{profile.role}</p>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Name", profile.name, "name", User],
              ["Email", profile.email, null, Mail],
              ["Phone", profile.phone || "", "phone", Phone],
              ["Location", profile.location || "", "location", MapPin],
            ].map(([label, value, name, Icon]: any) => (
              <div key={label} className="rounded-xl border p-4 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <label className="text-xs text-gray-500">{label}</label>
                {editing && name ? (
                  <input
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg px-3 py-2 border outline-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Icon size={16} />
                    <span>{value || "-"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex gap-4">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-purple-600 cursor-pointer">
                <Edit size={16} /> Edit Profile
              </button>
            ) : (
              <button onClick={handleSaveProfile} disabled={saving} className="bg-purple-600 text-white px-5 py-2 rounded-lg">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
