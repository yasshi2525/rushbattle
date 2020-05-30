import ParticipationButton from "../entities/participation_button";

const createStartScene = (game: g.Game): g.Scene => {
  const scene = new g.Scene({ game });
  scene.append(new ParticipationButton(scene).entity);
  return scene;
};

export default createStartScene;
