import { useEffect, useRef } from 'react';
import { useGetNotifications, useGetFeed, useGetUnprocessedJoinRequests, useGetCircleMembers } from '@/hooks/useQueries';
import { useSound } from '@/hooks/useSound';
import type { Notification, FeedItem, JoinRequest } from '@/backend';
import type { Principal } from '@dfinity/principal';

export default function SoundEffectsManager() {
  const { playNotification, playNewFeed, playCircleActivity } = useSound();

  // Track previous data to detect new items
  const prevNotifications = useRef<Notification[] | null>(null);
  const prevFeed = useRef<FeedItem[] | null>(null);
  const prevJoinRequests = useRef<JoinRequest[] | null>(null);
  const prevCircleMembers = useRef<Principal[] | null>(null);

  // Track if first load has completed for each query
  const notificationsFirstLoad = useRef(true);
  const feedFirstLoad = useRef(true);
  const joinRequestsFirstLoad = useRef(true);
  const circleMembersFirstLoad = useRef(true);

  const { data: notifications, isSuccess: notificationsSuccess } = useGetNotifications();
  const { data: feed, isSuccess: feedSuccess } = useGetFeed();
  const { data: joinRequests, isSuccess: joinRequestsSuccess } = useGetUnprocessedJoinRequests();
  const { data: circleMembers, isSuccess: circleMembersSuccess } = useGetCircleMembers();

  // Handle notifications
  useEffect(() => {
    if (!notificationsSuccess || !notifications) return;

    if (notificationsFirstLoad.current) {
      // First successful load - just store the data, don't play sound
      prevNotifications.current = notifications;
      notificationsFirstLoad.current = false;
      return;
    }

    // Check for new unread notifications
    if (prevNotifications.current) {
      const prevUnreadCount = prevNotifications.current.filter((n) => !n.isRead).length;
      const currentUnreadCount = notifications.filter((n) => !n.isRead).length;

      if (currentUnreadCount > prevUnreadCount) {
        playNotification();
      }
    }

    prevNotifications.current = notifications;
  }, [notifications, notificationsSuccess, playNotification]);

  // Handle feed
  useEffect(() => {
    if (!feedSuccess || !feed) return;

    if (feedFirstLoad.current) {
      // First successful load - just store the data, don't play sound
      prevFeed.current = feed;
      feedFirstLoad.current = false;
      return;
    }

    // Check for new feed items
    if (prevFeed.current && feed.length > prevFeed.current.length) {
      playNewFeed();
    }

    prevFeed.current = feed;
  }, [feed, feedSuccess, playNewFeed]);

  // Handle join requests
  useEffect(() => {
    if (!joinRequestsSuccess || !joinRequests) return;

    if (joinRequestsFirstLoad.current) {
      // First successful load - just store the data, don't play sound
      prevJoinRequests.current = joinRequests;
      joinRequestsFirstLoad.current = false;
      return;
    }

    // Check for new join requests
    if (prevJoinRequests.current && joinRequests.length > prevJoinRequests.current.length) {
      playCircleActivity();
    }

    prevJoinRequests.current = joinRequests;
  }, [joinRequests, joinRequestsSuccess, playCircleActivity]);

  // Handle circle members
  useEffect(() => {
    if (!circleMembersSuccess || !circleMembers) return;

    if (circleMembersFirstLoad.current) {
      // First successful load - just store the data, don't play sound
      prevCircleMembers.current = circleMembers;
      circleMembersFirstLoad.current = false;
      return;
    }

    // Check for new circle members
    if (prevCircleMembers.current && circleMembers.length > prevCircleMembers.current.length) {
      playCircleActivity();
    }

    prevCircleMembers.current = circleMembers;
  }, [circleMembers, circleMembersSuccess, playCircleActivity]);

  // This component doesn't render anything
  return null;
}
