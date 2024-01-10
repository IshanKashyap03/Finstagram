import React from 'react';
import { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import OLMap from '../../shared/components/UIElements/OLMap';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from './LoadingSpinner';
import ErrorModal from './ErrorModal';
import './PlaceItem.css'

const PlaceItem = props => {
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const {isloading, error, sendRequest, errorHandler} = useHttpClient();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler= () => {
        setShowMap(true);
    }

    const closeMapHandler= () => {
        setShowMap(false);
    }

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    }

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try{
            await sendRequest(`http://localhost:5001/api/places/${props.id}`,
            'DELETE'
        );
        props.onDelete(props.id);
        }catch(err){

        }

    };

    return ( 
    <React.Fragment>
        <ErrorModal error={error} onClear = {errorHandler}/>
        <Modal show={showMap} onCancel={closeMapHandler} header={props.address}
        contentClass ='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
        >
            <div className='map-container'>
                <OLMap center={[props.coordinates.lng, props.coordinates.lat]} zoom={2}/>
            </div>
        </Modal>

    <Modal 
        show={showConfirmModal}
        onCancel = {cancelDeleteHandler}
        header="Are you sure?" footerClass="place-item__modal-actions" footer={
        <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
        </React.Fragment>
    }>
        <p>Do you want to proceed and delete this place? Please note that it cant be undone thereafter.</p>
    </Modal>

    <li className='place-item'>
        <Card className='place-item__content'>
            {isloading && <LoadingSpinner asOverlay/>}
        <div className='place-item__image'>
            <img src={props.image} alt={props.title}></img>
        </div>
        <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
        </div>
        <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
           {auth.userId === props.creatorId && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
        </div>
        </Card>
    </li>
    </React.Fragment>
    );
};

export default PlaceItem;