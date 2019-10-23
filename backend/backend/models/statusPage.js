var mongoose = require('../config/db');

var Schema = mongoose.Schema;
var statusSchema = new Schema({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', alias: 'project' }, //which project this statuspage belongs to.
    domain: String,
    monitorIds: [{ type: String, ref: 'Monitor' }],
    links: Array,
    title: String,
    name: String,
    isPrivate: Boolean,
    isSubscriberEnabled: Boolean,
    isGroupedByMonitorCategory: {
        type: Boolean,
        default: false
    },
    showScheduledEvents: {
        type: Boolean,
        default: true
    },
    description: String,
    copyright: String,
    faviconPath: String,
    logoPath: String,
    createdAt: {
        type: Date,
        default: Date.now
    },

    deleted: { type: Boolean, default: false, select: false },
    
    deletedAt: {
        type: Date,
        select: false
    },

    deletedById: { type: String, ref: 'User', select: false },
    __v: { type: Number, select: false }
});
module.exports = mongoose.model('StatusPage', statusSchema);