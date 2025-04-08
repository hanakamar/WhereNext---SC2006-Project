import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Planner, { isValidTimeFormat, isTimeSlotAvailable } from './planner';
import { useLocalSearchParams, useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({ item: undefined })),
}));

describe('Planner Component Tests', () => {
  let mockRouteParams;
  let mockRouter;
  let plannerState;
  let setPlannerState;

  beforeEach(() => {
    mockRouteParams = { item: undefined };
    mockRouter = { push: jest.fn() };
    useLocalSearchParams.mockReturnValue(mockRouteParams);
    useRouter.mockReturnValue(mockRouter);
    plannerState = [{ name: 'Event 1', time: '' }, { name: 'Event 2', time: '10:00 AM' }];
    setPlannerState = jest.fn((updated) => (plannerState = updated));

    jest.spyOn(React, 'useState').mockImplementation((initialState) => {
      if (initialState instanceof Array) {
        return [plannerState, setPlannerState];
      }
      return [initialState, jest.fn()];
    });
  });

  afterEach(() => {
    React.useState.mockRestore();
  });

  describe('isValidTimeFormat', () => {
    it('should return true for valid time formats', () => {
      expect(isValidTimeFormat('9:00 AM')).toBe(true);
      expect(isValidTimeFormat('1:30 PM')).toBe(true);
      expect(isValidTimeFormat('12:00 AM')).toBe(true);
      expect(isValidTimeFormat('12:00 PM')).toBe(true);
    });

  });

  describe('isTimeSlotAvailable', () => {
    it('should return true if the time slot is not taken', () => {
      const currentPlanner = [{ name: 'Event 1', time: '' }, { name: 'Event 2', time: '10:00 AM' }];
      expect(isTimeSlotAvailable(currentPlanner, 0, '9:00 AM')).toBe(true);
    });

    it('should return false if the time slot is already taken by another item', () => {
      const currentPlanner = [{ name: 'Event 1', time: '' }, { name: 'Event 2', time: '10:00 AM' }];
      expect(isTimeSlotAvailable(currentPlanner, 0, '10:00 AM')).toBe(false);
    });

    it('should return true if checking the availability of the current item\'s time', () => {
      const currentPlanner = [{ name: 'Event 1', time: '9:00 AM' }, { name: 'Event 2', time: '10:00 AM' }];
      expect(isTimeSlotAvailable(currentPlanner, 0, '9:00 AM')).toBe(true);
    });

    it('should return true for an empty time slot', () => {
      const currentPlanner = [{ name: 'Event 1', time: '' }, { name: 'Event 2', time: '10:00 AM' }];
      expect(isTimeSlotAvailable(currentPlanner, 0, '')).toBe(true);
      expect(isTimeSlotAvailable(currentPlanner, 1, '')).toBe(true);
    });
  });

  });
