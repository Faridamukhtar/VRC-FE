import React, { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { debounce } from 'lodash';
import { twJoin } from 'tailwind-merge';
import { BeatLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import Input from '../../shared/Input';

import RoomAssetsItem from './RoomAssetsItem';
import { IRoomAssetsInfo, IRoomAssetsItem } from '../../../models/room-assets';

export interface IAssetsInfiniteListProps<AssetType> {
    infiniteListContainerId: string;
    assetsInfo: IRoomAssetsInfo<AssetType>;
    searchInputPlaceholder: string;
    allowFetchingNextPageHandler: () => void;
    fetchNextPageHandler: () => void;
    changeQueryHandler: (query: string) => void;
    clickAssetsItemHandler: (assetsItem: AssetType) => void;
}

function AssetsInfiniteList<AssetType extends IRoomAssetsItem>(
    props: React.PropsWithoutRef<IAssetsInfiniteListProps<AssetType>>
) {
    const {
        infiniteListContainerId,
        assetsInfo,
        searchInputPlaceholder,
        allowFetchingNextPageHandler,
        fetchNextPageHandler,
        changeQueryHandler,
        clickAssetsItemHandler,
    } = props;

    const { searchInfo, items } = assetsInfo;
    const { hasNext, allowFetchingNextPage, pageNumber, q, isLoading } = searchInfo;

    const { ref: listEndElementRef, inView: isListEndElementInView } = useInView({
        triggerOnce: true,
        threshold: 0,
        root: document.getElementById(infiniteListContainerId),
        rootMargin: '500px',
    });

    useEffect(() => {
        if (!isListEndElementInView || !hasNext) {
            return;
        }

        allowFetchingNextPageHandler();
    }, [isListEndElementInView, hasNext]);

    useEffect(() => {
        if (!allowFetchingNextPage) {
            return;
        }

        fetchNextPageHandler();
    }, [pageNumber, q, allowFetchingNextPage]);

    const handleSearchQuery = useCallback(
        debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            changeQueryHandler(e.target.value);
        }, 500),
        []
    );

    return (
        <div className={'flex flex-col space-y-8 w-full h-full'}>
            <Input
                type="text"
                id="assets-search-input"
                className={twJoin(
                    'bg-simulation-room-sidebar-bg placeholder:text-simulation-room-sidebar-color text-simulation-room-sidebar-color',
                    'border border-simulation-room-bg'
                )}
                inputContainerProps={{ className: 'mt-0' }}
                placeholder={searchInputPlaceholder}
                defaultValue={q}
                Icon={
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-simulation-room-sidebar-color"
                    />
                }
                onChange={handleSearchQuery}
            />

            <div id={infiniteListContainerId} className="overflow-auto h-full">
                <ul className="grid grid-cols-2 gap-4 select-none">
                    {items.map((item, idx) => {
                        return (
                            <button key={item.id} onClick={clickAssetsItemHandler.bind(null, item)}>
                                <RoomAssetsItem
                                    ref={idx === items.length - 1 ? listEndElementRef : undefined}
                                    item={item}
                                />
                            </button>
                        );
                    })}
                </ul>
                {isLoading && (
                    <BeatLoader
                        className="p-5 text-center"
                        color="rgb(var(--simulation-room-sidebar-menu-color))"
                    />
                )}
            </div>
        </div>
    );
}

export default AssetsInfiniteList;
