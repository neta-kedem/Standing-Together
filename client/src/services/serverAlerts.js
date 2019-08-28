export default ({
    missingPermission: {
        content: "you don't have permissions to view this page, switch user?",
        flush: true,
        opaque: true,
        onClose: () => window.location.href = '/Login',
        resolutionOptions: [
            {
                label: "yes",
                onClick: () => window.location.href = '/Login',
            },
            {
                label: "no",
                onClick: () => window.location.href = '/Welcome',
            },
        ]
    },
    missingToken: {
        content: "you aren't logged in",
        flush: true,
        opaque: true,
        onClose: () => window.location.href = '/Login',
        resolutionOptions: [
            {
                label: "ok",
                onClick: () => window.location.href = '/Login',
            }
        ]
    },
    suspendedSession: {

    }
})