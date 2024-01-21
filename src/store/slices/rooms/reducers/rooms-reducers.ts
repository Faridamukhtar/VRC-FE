import { PayloadAction } from '@reduxjs/toolkit';

import { IStoreRoomsSlice } from '../../../../models/app-store';
import { IRoom, IRoomState } from '../../../../models/room';

const initialRoomState: IRoomState = {
    meshes: {},
    clouds: {},
    models: {},
    stars: false,
    selectedObjectInfo: null,
};

const roomsReducers = {
    addRooms(storeRoomsSlice: IStoreRoomsSlice, action: PayloadAction<IRoom<string>[]>) {
        for (const room of action.payload) {
            storeRoomsSlice.rooms[room.id] = room;
        }
    },
    addRoom(storeRoomsSlice: IStoreRoomsSlice, action: PayloadAction<IRoom<string>>) {
        storeRoomsSlice.rooms[action.payload.id] = action.payload;
    },
    clearRooms(storeRoomsSlice: IStoreRoomsSlice) {
        storeRoomsSlice.rooms = {};
    },
    selectedRoom(storeRoomsSlice: IStoreRoomsSlice, action: PayloadAction<IRoom<string> | null>) {
        const room = action.payload;

        if (room === null) {
            storeRoomsSlice.selectedRoom = null;
            return;
        }

        let stateAsJSON;

        try {
            stateAsJSON = JSON.parse(room.state || '{}');
        } catch (_) {
            stateAsJSON = {};
        }

        storeRoomsSlice.selectedRoom = {
            ...room,
            state: {
                ...initialRoomState,
                ...stateAsJSON,
            },
        };
    },
};

export default roomsReducers;