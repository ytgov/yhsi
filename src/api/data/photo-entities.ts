export const PHOTO_FIELDS = [
	'rowId',
	'id',
	'placeId',
	'originalFileName',
	'featureName',
	'communityId',
	'nTSMapNumber',
	'address',
	'dateCreated',
	'datePhotoTaken',
	'yHSIRecord',
	'bordenRecord',
	'paleoRecord',
	'archivalRecord',
	'isOtherRecord',
	'originalMediaId',
	'originalRecord',
	'mediaStorage',
	'comments',
	'caption',
	'copyright',
	'creditLine',
	'ownerId',
	'photoProjectId',
	'program',
	'creator',
	'communityName',
	'location',
	'usageRights',
	'isComplete',
	'imageHeight',
	'imageWidth',
	'rating',
	'subjects',
	'legacyBatchInfo',
	'isSiteDefault',
	'isPrivate',
];

export const PHOTO_BATCH_FIELDS = [
	'name',
	'placeId',
	'communityId',
	'nTSMapNumber',
	'address',
	'dateCreated',
	'yHSIRecord',
	'bordenRecord',
	'paleoRecord',
	'archivalRecord',
	'isOtherRecord',
	'originalMediaId',
	'originalRecord',
	'mediaStorage',
	'comments',
	'caption',
	'copyright',
	'creditLine',
	'ownerId',
	'photoProjectId',
	'program',
	'creator',
	'communityName',
	'location',
	'usageRights',
	'isComplete',
	'subjects',
	'isPrivate',
];

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
	datePhotoTaken!: Date;
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
	thumbFile!: Buffer;
	isPrivate!: boolean;
}

export class PhotoBatch {
	id!: number;
	name!: string;
	userId!: number;
	dateCreated!: Date;
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
	isPrivate!: boolean;
}

export class PhotoBatchPhoto {
	id!: number;
	photoBatchId!: number;
	photoFile!: Buffer;
	photoFileName!: string;
	photoContentType!: string;
	thumbFile!: Buffer;
}

export class SavedFilter {
	id!: number;
	userId!: number;
	name!: string;
	resultType!: string;
	value!: string;
}
