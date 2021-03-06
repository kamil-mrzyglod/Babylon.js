import { Camera, Observer, Scene, Nullable, IExplorerExtensibilityGroup } from "babylonjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faCamera } from '@fortawesome/free-solid-svg-icons';
import { TreeItemLabelComponent } from "../treeItemLabelComponent";
import { ExtensionsComponent } from "../extensionsComponent";
import * as React from "react";

interface ICameraTreeItemComponentProps {
    camera: Camera,
    extensibilityGroups?: IExplorerExtensibilityGroup[],
    onClick: () => void
}

export class CameraTreeItemComponent extends React.Component<ICameraTreeItemComponentProps, { isActive: boolean }> {
    private _onActiveCameraObserver: Nullable<Observer<Scene>>;

    constructor(props: ICameraTreeItemComponentProps) {
        super(props);

        const camera = this.props.camera;
        const scene = camera.getScene();

        this.state = { isActive: scene.activeCamera === camera };
    }

    setActive(): void {
        const camera = this.props.camera;
        const scene = camera.getScene();

        scene.activeCamera = camera;
        camera.attachControl(scene.getEngine().getRenderingCanvas()!, true);


        this.setState({ isActive: true });
    }

    componentWillMount() {
        const camera = this.props.camera;
        const scene = camera.getScene();
        this._onActiveCameraObserver = scene.onActiveCameraChanged.add(() => {
            if (this.state.isActive) {
                camera.detachControl(scene.getEngine().getRenderingCanvas()!);
            }

            this.setState({ isActive: scene.activeCamera === camera });
        });
    }

    componentWillUnmount() {
        if (this._onActiveCameraObserver) {
            const camera = this.props.camera;
            const scene = camera.getScene();

            scene.onActiveCameraChanged.remove(this._onActiveCameraObserver);
        }
    }

    render() {
        const isActiveElement = this.state.isActive ? <FontAwesomeIcon icon={faVideo} /> : <FontAwesomeIcon icon={faVideo} className="isNotActive" />;

        return (
            <div className="cameraTools">
                <TreeItemLabelComponent label={this.props.camera.name} onClick={() => this.props.onClick()} icon={faCamera} color="green" />
                <div className="activeCamera icon" onClick={() => this.setActive()} title="Set as main camera">
                    {isActiveElement}
                </div>
                <ExtensionsComponent target={this.props.camera} extensibilityGroups={this.props.extensibilityGroups} />
            </div>
        )
    }
}