
export class Photo {
    rowId!: number;
    id!: number;
    placeId!: number;
    file!: Buffer;
    originalFileName!: string;
    featureName!: string;
    communityId!: number;
    nTSMapNumber!: string;
    address!: string;
    dateCreated!: Date;
    yHSIRecord!: string;
    bordenRecord!: string;
    paleoRecord!: string;
    archivalRecord!: string;
    isOtherRecord!: boolean;
    originalMediaId!: number;
    originalRecord!: string;
    mediaStorage!: number;
    comments!: string;
    caption!: string;
    copyright!: number;
    creditLine!: string;
    ownerId!: number;
    photoProjectId!: number;
    program!: number;
    creator!: string;
    communityName!: string;
    location!: string;
    usageRights!: number;
    isComplete!: boolean;
    imageHeight!: number;
    imageWidth!: number;
    rating!: number;
    subjects!: string;
    legacyBatchInfo!: string;
    isSiteDefault!: boolean;
}

export class PhotoBatch {
    id!: number;
    name!: string;
    userId!: number;
    createDate!: Date;
    placeId!: number;
    communityId!: number;
    nTSMapNumber!: string;
    address!: string;
    yHSIRecord!: string;
    bordenRecord!: string;
    paleoRecord!: string;
    archivalRecord!: string;
    isOtherRecord!: boolean;
    originalMediaId!: number;
    originalRecord!: string;
    mediaStorage!: number;
    comments!: string;
    caption!: string;
    copyright!: number;
    creditLine!: string;
    ownerId!: number;
    photoProjectId!: number;
    program!: number;
    creator!: string;
    communityName!: string;
    location!: string;
    usageRights!: number;
    isComplete!: boolean;
    subjects!: string;
}

export class PhotoBatchPhoto {
    id!: number;
    photoBatchId!: number;
    photoFile!: Buffer;
    photoFileName!: string;
    photoContentType!: string;
}
