import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThreeEvent } from '@react-three/fiber';

import LightItem from './Light';

import { IAppStore } from '../../../../models/app-store';
import { IRoomObject } from '../../../../models/room';
import { TAppDispatch } from '../../../../store/app-store';
import { storeRoomsSliceActions } from '../../../../store/slices/rooms/rooms-slice';
import RoomObjectUtil from '../../../../utilities/room-object.ts';

const Lights = () => {
    const lights = useSelector((store: IAppStore) => store.rooms.selectedRoom?.state.lights);
    const dispatch = useDispatch<TAppDispatch>();

    const handleObjectSelection = (e: ThreeEvent<MouseEvent>, objectId: IRoomObject['id']) => {
        e.stopPropagation();
        dispatch(storeRoomsSliceActions.selectObject({ type: 'lights', id: objectId }));
    };

    return Object.values(lights || {}).map((light) => {
        const { id, rotation, type, ...restProps } = light;

        return (
            <group
                key={id}
                onDoubleClick={(e) => handleObjectSelection(e, id)}
                scale={[8, 8, 8]}
                position={restProps.position}
                rotation={RoomObjectUtil.convertRotationFromDegreeToEuler(rotation)}
            >
                <LightItem key={id} type={type} color={restProps.color} intensity={restProps.intensity} />
            </group>
        );
    });
};

export default React.memo(Lights);
