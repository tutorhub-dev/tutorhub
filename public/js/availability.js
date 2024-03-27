function deleteAvailability(slotId) {
    const body = JSON.stringify({ slot_id: slotId });

    fetch(`/api/tutor/`, { /* Maybe add a slotId feature in the availability API? */
        method: 'DELETE',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        }),
        body: body
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete availability');
        document.querySelector(`button[data-id="${slotId}"]`).closest("tr").remove();
    })
    .catch(error => console.error('Failed to delete availability:', error));
}