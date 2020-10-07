import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProtectedResource, postWithCredentials } from '../data';
import { useUser } from '../auth';

export const PhotoDetailPage = () => {
    const [inviteEmailValue, setInviteEmailValue] = useState('');
    const { id } = useParams();
    const { isLoading, data: photo, setData: setPhoto } = useProtectedResource(`/photos/${id}`, {});
    const { user } = useUser();
    const userIsOwner = user.uid === photo.ownerId;

    const shareWithEmail = async () => {
        const response = await postWithCredentials(`/photos/${id}/shared-with`, { email: inviteEmailValue });
        const updatedPhoto = await response.json();
        setPhoto(updatedPhoto);
        setInviteEmailValue('');
    }

    return isLoading
        ? <p>Loading...</p>
        : (
            <div className="centered-container">
                <h1>{photo.title}</h1>
                <img src={'/images' + photo.url} width="750" />
                <div>
                    {userIsOwner
                        ? (
                        <>
                        <h3>Shared with:</h3>
                        {photo.sharedWithEmails.map(email => (
                            <div>
                                <p>{email}</p>
                            </div>
                        ))}
                        <div className="share-with-form">
                            <input
                                type="text"
                                value={inviteEmailValue}
                                placeholder="Enter an email address to share with"
                                onChange={e => setInviteEmailValue(e.target.value)} />
                            <button onClick={shareWithEmail}>Share</button>
                        </div>
                        </>
                        ) : null}
                </div>
            </div>
        );
}